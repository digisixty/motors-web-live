using System.Text.Json.Serialization;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MyApp.Application.CarListings.Common;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;

namespace MyApp.Application.CarListings.Commands.CreateCarListing;

[Authorize(Roles = Roles.Administrator)]
public record CreateCarListingCommand : IRequest<int>
{
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

public class CreateCarListingCommandHandler : IRequestHandler<CreateCarListingCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateCarListingCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateCarListingCommand request, CancellationToken cancellationToken)
    {
        var stockNumber = await GenerateUniqueStockNumber(cancellationToken);
        var entity = new CarListing
        {
            StockNumber = stockNumber,
            Slug = await GenerateUniqueSlug(stockNumber, cancellationToken),
            VinNumber = request.VinNumber,
            RegistrationDate = request.RegistrationDate,
            PrimaryImage = request.PrimaryImage,
            InteriorImages = request.InteriorImages,
            ExteriorImages = request.ExteriorImages,
            Videos = request.Videos,
            Price = request.Price,
            SalePrice = request.SalePrice,
            IsSold = request.IsSold,
            CustomPriceLabel = request.CustomPriceLabel,
            CardFooterLabel = request.CardFooterLabel,
            IsSpecialOffer = request.IsSpecialOffer,
            Description = request.Description,
            ManufacturerId = request.ManufacturerId,
            CarModelId = request.CarModelId,
            MetaTags = request.MetaTags
        };

        // Add car listing attributes if provided
        foreach (var attrRequest in request.CarAttributes)
        {
            entity.CarListingAttributes.Add(new CarListingAttribute
            {
                CarAttributeId = attrRequest.CarAttributeId,
                Value = attrRequest.Value
            });
        }

        // Add car listing options if provided
        foreach (var optRequest in request.CarOptions)
        {
            entity.CarListingOptions.Add(new CarListingOption
            {
                CarOptionId = optRequest.CarOptionId,
                Value = optRequest.Value
            });
        }

        _context.CarListings.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }

    private async Task<string> GenerateUniqueStockNumber(CancellationToken cancellationToken)
    {
        var random = new Random();
        var maxAttempts = 100;
        var attempts = 0;

        do
        {
            var stockNumber = GenerateRandomStockNumber(random);

            // Check if this stock number already exists
            var exists = await _context.CarListings
                .AnyAsync(cl => cl.StockNumber == stockNumber, cancellationToken);

            if (!exists)
            {
                return stockNumber;
            }

            attempts++;
        } while (attempts < maxAttempts);

        // Fallback in case of extreme unlikelihood (all MOT + 6 digit combinations are taken)
        // Use timestamp + random to ensure uniqueness
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
        var randomSuffix = random.Next(100, 999).ToString();
        var digits = (timestamp + randomSuffix)[..6]; // Ensure we have 6 digits
        return $"MOT-{digits}";
    }

    private async Task<string> GenerateUniqueSlug(string stockNumber, CancellationToken cancellationToken)
    {
        var baseSlug = GenerateSlugFromStockNumber(stockNumber);
        var slug = baseSlug;
        var counter = 1;

        // Keep adding counter until we find a unique slug
        while (await _context.CarListings
            .AnyAsync(cl => cl.Slug == slug, cancellationToken))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
    }

    private static string GenerateSlugFromStockNumber(string stockNumber)
    {
        // Convert stock number to a URL-friendly slug
        // Example: "MOT-123456" -> "mot-123456"
        return stockNumber.ToLowerInvariant().Replace('_', '-');
    }

    private static string GenerateRandomStockNumber(Random random)
    {
        // Generate 6 random digits
        var digits = new char[6];
        for (int i = 0; i < 6; i++)
        {
            digits[i] = (char)('0' + random.Next(10));
        }

        return $"MOT-{new string(digits)}";
    }
}
