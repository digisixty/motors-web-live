using Microsoft.EntityFrameworkCore;
using MediatR;
using MyApp.Application.CarListings.Common;
using MyApp.Application.Common.Interfaces;
using MyApp.Domain.Entities;

namespace MyApp.Application.CarListings.Queries.GetCarListingById;

public record GetCarListingByIdQuery : IRequest<CarListingDto?>
{
    public int Id { get; init; }
}

public class GetCarListingByIdQueryHandler : IRequestHandler<GetCarListingByIdQuery, CarListingDto?>
{
    private readonly IApplicationDbContext _context;

    public GetCarListingByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CarListingDto?> Handle(GetCarListingByIdQuery request, CancellationToken cancellationToken)
    {
        var carListing = await _context.CarListings
            .Include(cl => cl.CarListingAttributes)
            .ThenInclude(cla => cla.CarAttribute)
            .Include(cl => cl.CarListingOptions)
            .ThenInclude(clo => clo.CarOption)
            .ThenInclude(co => co.Parent)
            .Include(cl => cl.Manufacturer)
            .Include(cl => cl.CarModel)
            .Where(cl => cl.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (carListing == null)
            return null;

        return new CarListingDto
        {
            Id = carListing.Id,
            StockNumber = carListing.StockNumber,
            Slug = carListing.Slug,
            VinNumber = carListing.VinNumber,
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
            Description = carListing.Description,
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
                    CarAttributeDescription = cla.CarAttribute.Description
                })
                .ToList(),
            CarListingOptions = GetCarListingOptionsWithParents(carListing.CarListingOptions.ToList())
        };
    }

    private static List<CarListingOptionDto> GetCarListingOptionsWithParents(List<CarListingOption> carListingOptions)
    {
        var result = new List<CarListingOptionDto>();
        var processedOptionIds = new HashSet<int>();

        foreach (var clo in carListingOptions)
        {
            // Add the current option
            if (processedOptionIds.Add(clo.CarOptionId))
            {
                result.Add(new CarListingOptionDto
                {
                    CarOptionId = clo.CarOptionId,
                    CarOptionName = clo.CarOption.Name,
                    CarOptionSlug = !string.IsNullOrEmpty(clo.CarOption.Slug) ? clo.CarOption.Slug : clo.CarOption.Name,
                    CarOptionParentId = clo.CarOption.ParentId,
                    Value = clo.Value,
                    CarOptionType = clo.CarOption.Type
                });
            }

            // If this option has a parent, add the parent too
            if (clo.CarOption.ParentId.HasValue && processedOptionIds.Add(clo.CarOption.ParentId.Value))
            {
                var parentOption = clo.CarOption.Parent;
                if (parentOption != null)
                {
                    result.Add(new CarListingOptionDto
                    {
                        CarOptionId = parentOption.Id,
                        CarOptionName = parentOption.Name,
                        CarOptionSlug = !string.IsNullOrEmpty(parentOption.Slug) ? parentOption.Slug : parentOption.Name,
                        CarOptionParentId = parentOption.ParentId,
                        Value = null, // Parent options don't have values
                        CarOptionType = parentOption.Type
                    });
                }
            }
        }

        return result;
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
