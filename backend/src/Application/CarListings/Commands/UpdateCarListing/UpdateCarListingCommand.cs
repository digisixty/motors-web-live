using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Application.CarListings.Common;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;

namespace MyApp.Application.CarListings.Commands.UpdateCarListing;

[Authorize(Roles = Roles.Administrator)]
public record UpdateCarListingCommand : IRequest
{
    public int Id { get; init; }
    public string? Slug { get; init; }
    public string? VinNumber { get; init; }
    public DateTimeOffset? RegistrationDate { get; init; }
    public string? PrimaryImage { get; init; }
    public string? InteriorImages { get; init; }
    public string? ExteriorImages { get; init; }
    public string? Videos { get; init; }
    public decimal? Price { get; init; }
    public decimal? SalePrice { get; init; }
    public bool IsSold { get; init; }
    public string? CustomPriceLabel { get; init; }
    public string? CardFooterLabel { get; init; }
    public bool IsSpecialOffer { get; init; }
    public string? Description { get; init; }
    public int? ManufacturerId { get; init; }
    public int? CarModelId { get; init; }
    public string? MetaTags { get; init; }
    [JsonPropertyName("carAttributes")]
    public List<CarAttributeRequest> CarAttributes { get; init; } = new();
    [JsonPropertyName("carOptions")]
    public List<CarOptionRequest> CarOptions { get; init; } = new();
}

public class UpdateCarListingCommandHandler : IRequestHandler<UpdateCarListingCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateCarListingCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateCarListingCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.CarListings
            .Include(cl => cl.CarListingAttributes)
            .Include(cl => cl.CarListingOptions)
            .FirstOrDefaultAsync(cl => cl.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(CarListing), request.Id.ToString());
        }

        // Update slug if provided
        if (!string.IsNullOrEmpty(request.Slug))
        {
            // Check if slug is unique (excluding current entity)
            var slugExists = await _context.CarListings
                .AnyAsync(cl => cl.Slug == request.Slug && cl.Id != entity.Id, cancellationToken);

            if (slugExists)
            {
                throw new ArgumentException("Slug must be unique. Another car listing with this slug already exists.");
            }

            entity.Slug = request.Slug;
        }

        entity.VinNumber = request.VinNumber;
        entity.RegistrationDate = request.RegistrationDate;
        entity.PrimaryImage = request.PrimaryImage;
        entity.InteriorImages = request.InteriorImages;
        entity.ExteriorImages = request.ExteriorImages;
        entity.Videos = request.Videos;
        entity.Price = request.Price;
        entity.SalePrice = request.SalePrice;
        entity.IsSold = request.IsSold;
        entity.CustomPriceLabel = request.CustomPriceLabel;
        entity.CardFooterLabel = request.CardFooterLabel;
        entity.IsSpecialOffer = request.IsSpecialOffer;
        entity.Description = request.Description;
        entity.ManufacturerId = request.ManufacturerId;
        entity.CarModelId = request.CarModelId;
        entity.MetaTags = request.MetaTags;

        // Remove existing car listing attributes
        entity.CarListingAttributes.Clear();

        // Add updated car listing attributes
        foreach (var attrRequest in request.CarAttributes)
        {
            entity.CarListingAttributes.Add(new CarListingAttribute
            {
                CarAttributeId = attrRequest.CarAttributeId,
                Value = attrRequest.Value
            });
        }

        // Remove existing car listing options
        entity.CarListingOptions.Clear();

        // Add updated car listing options
        foreach (var optRequest in request.CarOptions)
        {
            entity.CarListingOptions.Add(new CarListingOption
            {
                CarOptionId = optRequest.CarOptionId,
                Value = optRequest.Value
            });
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}