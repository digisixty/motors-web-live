using Microsoft.EntityFrameworkCore;
using MediatR;
using MyApp.Application.CarListings.Common;
using MyApp.Application.Common.Interfaces;
using MyApp.Domain.Entities;

namespace MyApp.Application.CarListings.Queries.GetCarListingById;

public record GetPublicCarListingByIdQuery : IRequest<PublicCarListingDto?>
{
    public int Id { get; init; }
}

public class GetPublicCarListingByIdQueryHandler : IRequestHandler<GetPublicCarListingByIdQuery, PublicCarListingDto?>
{
    private readonly IApplicationDbContext _context;

    public GetPublicCarListingByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PublicCarListingDto?> Handle(GetPublicCarListingByIdQuery request, CancellationToken cancellationToken)
    {
        var carListing = await _context.CarListings
            .Include(cl => cl.CarListingAttributes)
            .ThenInclude(cla => cla.CarAttribute)
            .Include(cl => cl.Manufacturer)
            .Include(cl => cl.CarModel)
            .Where(cl => cl.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (carListing == null)
            return null;

        return new PublicCarListingDto
        {
            Id = carListing.Id,
            StockNumber = carListing.StockNumber,
            Slug = carListing.Slug,
            RegistrationDate = carListing.RegistrationDate,
            PrimaryImage = carListing.PrimaryImage,
            InteriorImages = carListing.InteriorImages,
            ExteriorImages = carListing.ExteriorImages,
            Videos = carListing.Videos,
            Price = carListing.Price,
            SalePrice = carListing.SalePrice,
            IsSold = carListing.IsSold,
            CustomPriceLabel = carListing.CustomPriceLabel,
            IsSpecialOffer = carListing.IsSpecialOffer,
            CardFooterLabel = carListing.CardFooterLabel,
            ManufacturerId = carListing.ManufacturerId,
            ManufacturerName = carListing.Manufacturer?.Title,
            CarModelId = carListing.CarModelId,
            CarModelName = carListing.CarModel?.Name,
            MetaTags = carListing.MetaTags,
            MetaTagsObject = carListing.MetaTagsObject,
            AbsoluteInteriorImages = ConvertToAbsoluteUrls(carListing.InteriorImages),
            AbsoluteExteriorImages = ConvertToAbsoluteUrls(carListing.ExteriorImages),
            AbsoluteVideos = ConvertToAbsoluteUrls(carListing.Videos),
            PrimaryImageAbsoluteUrl = !string.IsNullOrEmpty(carListing.PrimaryImage) ?
                Domain.Common.StaticConfiguration.GetAbsoluteUrl(carListing.PrimaryImage) : null,
            CarListingAttributes = carListing.CarListingAttributes
                .Select(cla => new CarListingAttributeDto
                {
                    Id = cla.Id,
                    CarAttributeId = cla.CarAttributeId,
                    CarAttributeName = cla.CarAttribute.Name,
                    CarAttributeSlug = !string.IsNullOrEmpty(cla.CarAttribute.Slug) ? cla.CarAttribute.Slug : cla.CarAttribute.Name,
                    CarAttributeParentId = cla.CarAttribute.ParentId,
                    Value = cla.Value,
                    CarAttributeDescription = cla.CarAttribute.Description,
                    ImageAbsoluteUrl = !string.IsNullOrEmpty(cla.CarAttribute.Image) ?
                        Domain.Common.StaticConfiguration.GetAbsoluteUrl(cla.CarAttribute.Image) : null,
                    IconAbsoluteUrl = !string.IsNullOrEmpty(cla.CarAttribute.Icon) ?
                        Domain.Common.StaticConfiguration.GetAbsoluteUrl(cla.CarAttribute.Icon) : null
                })
                .ToList()
        };
    }

    private static List<string> ConvertToAbsoluteUrls(string? urlString)
    {
        if (string.IsNullOrEmpty(urlString))
            return new List<string>();

        return urlString
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(url => url.Trim())
            .Where(url => !string.IsNullOrEmpty(url))
            .Select(url => Domain.Common.StaticConfiguration.GetAbsoluteUrl(url))
            .ToList();
    }
}