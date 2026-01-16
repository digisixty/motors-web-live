using MediatR;
using Microsoft.EntityFrameworkCore;
using MyApp.Application.CarListings.Common;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;
using MyApp.Domain.Entities;

namespace MyApp.Application.CarListings.Queries.GetCarListings;

public record GetPublicCarListingsQuery : IRequest<PaginatedList<PublicCarListingDto>>
{
    public int? PageNumber { get; init; } = 1;
    public int? PageSize { get; init; } = 10;

    // Filter parameters
    public bool? IsSold { get; init; }
    public bool? IsSpecialOffer { get; init; }

    // Additional public filters
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
    public int? ManufacturerId { get; init; }
    public int? CarModelId { get; init; }

    // Sorting parameters
    public string? SortBy { get; init; } = "stockNumber";
    public string? SortDirection { get; init; } = "asc";

    // Attribute filters: key = CarAttributeId, value = filter value
    public Dictionary<int, string>? AttributeFilters { get; init; }

    // Search query for searching multiple terms including stock number
    public string? SearchQuery { get; init; }
}

public class GetPublicCarListingsQueryHandler : IRequestHandler<GetPublicCarListingsQuery, PaginatedList<PublicCarListingDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPublicCarListingsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<PublicCarListingDto>> Handle(GetPublicCarListingsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.CarListings
            .Include(cl => cl.CarListingAttributes)
            .ThenInclude(cla => cla.CarAttribute)
            .Include(cl => cl.CarListingOptions)
            .ThenInclude(clo => clo.CarOption)
            .ThenInclude(co => co.Parent)
            .Include(cl => cl.Manufacturer)
            .Include(cl => cl.CarModel)
            .AsQueryable();

        // Apply filters
        if (request.IsSold.HasValue)
        {
            query = query.Where(cl => cl.IsSold == request.IsSold.Value);
        }

        if (request.IsSpecialOffer.HasValue)
        {
            query = query.Where(cl => cl.IsSpecialOffer == request.IsSpecialOffer.Value);
        }

        // Price range filters
        if (request.MinPrice.HasValue)
        {
            query = query.Where(cl => cl.Price != null && cl.Price >= request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(cl => cl.Price != null && cl.Price <= request.MaxPrice.Value);
        }

        // Manufacturer and Model filters
        if (request.ManufacturerId.HasValue)
        {
            query = query.Where(cl => cl.ManufacturerId == request.ManufacturerId.Value);
        }

        if (request.CarModelId.HasValue)
        {
            query = query.Where(cl => cl.CarModelId == request.CarModelId.Value);
        }

        // Apply attribute filters
        if (request.AttributeFilters != null && request.AttributeFilters.Any())
        {
            foreach (var attributeFilter in request.AttributeFilters)
            {
                var attributeId = attributeFilter.Key;
                var filterValue = attributeFilter.Value;

                query = query.Where(cl => cl.CarListingAttributes
                    .Any(cla => cla.CarAttributeId == attributeId &&
                               cla.Value != null &&
                               cla.Value.Contains(filterValue)));
            }
        }

        // Apply search query
        if (!string.IsNullOrEmpty(request.SearchQuery))
        {
            var searchTerm = request.SearchQuery.Trim();
            query = query.Where(cl =>
                cl.StockNumber.Contains(searchTerm) ||
                (cl.VinNumber != null && cl.VinNumber.Contains(searchTerm)) ||
                (cl.Manufacturer != null && cl.Manufacturer.Title.Contains(searchTerm)) ||
                (cl.CarModel != null && cl.CarModel.Name.Contains(searchTerm)) ||
                cl.CarListingAttributes.Any(cla =>
                    cla.Value != null && cla.Value.Contains(searchTerm))
            );
        }

        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDirection);

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply pagination and get the data
        var pageNumber = request.PageNumber ?? 1;
        var pageSize = request.PageSize ?? 10;
        var carListings = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        // Process in memory to convert string URLs to absolute URLs
        var dtos = carListings.Select(cl => new PublicCarListingDto
        {
            Id = cl.Id,
            Slug = cl.Slug,
            StockNumber = cl.StockNumber,
            RegistrationDate = cl.RegistrationDate,
            PrimaryImage = cl.PrimaryImage,
            InteriorImages = cl.InteriorImages,
            ExteriorImages = cl.ExteriorImages,
            Videos = cl.Videos,
            Price = cl.Price,
            SalePrice = cl.SalePrice,
            IsSold = cl.IsSold,
            CustomPriceLabel = cl.CustomPriceLabel,
            IsSpecialOffer = cl.IsSpecialOffer,
            CardFooterLabel = cl.CardFooterLabel,
            Description = cl.Description,
            ManufacturerId = cl.ManufacturerId,
            ManufacturerName = cl.Manufacturer?.Title,
            CarModelId = cl.CarModelId,
            CarModelName = cl.CarModel?.Name,
            AbsoluteInteriorImages = ConvertToAbsoluteUrls(cl.InteriorImages),
            AbsoluteExteriorImages = ConvertToAbsoluteUrls(cl.ExteriorImages),
            AbsoluteVideos = ConvertToAbsoluteUrls(cl.Videos),
            PrimaryImageAbsoluteUrl = !string.IsNullOrEmpty(cl.PrimaryImage) ?
                Domain.Common.StaticConfiguration.GetAbsoluteUrl(cl.PrimaryImage) : null,
            CarListingAttributes = cl.CarListingAttributes
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
            CarListingOptions = GetCarListingOptionsWithParents(cl.CarListingOptions.ToList())
        }).ToList();

        return new PaginatedList<PublicCarListingDto>(dtos, totalCount, pageNumber, pageSize);
    }

    private static IQueryable<CarListing> ApplySorting(IQueryable<CarListing> query, string? sortBy, string? sortDirection)
    {
        var ascending = sortDirection?.ToLowerInvariant() != "desc";

        return sortBy?.ToLowerInvariant() switch
        {
            "price" => ascending ? query.OrderBy(cl => cl.Price) : query.OrderByDescending(cl => cl.Price),
            "saleprice" => ascending ? query.OrderBy(cl => cl.SalePrice) : query.OrderByDescending(cl => cl.SalePrice),
            "registrationdate" => ascending ? query.OrderBy(cl => cl.RegistrationDate) : query.OrderByDescending(cl => cl.RegistrationDate),
            "manufacturername" => ascending ? query.OrderBy(cl => cl.Manufacturer != null ? cl.Manufacturer.Title : string.Empty) : query.OrderByDescending(cl => cl.Manufacturer != null ? cl.Manufacturer.Title : string.Empty),
            "carmodelname" => ascending ? query.OrderBy(cl => cl.CarModel != null ? cl.CarModel.Name : string.Empty) : query.OrderByDescending(cl => cl.CarModel != null ? cl.CarModel.Name : string.Empty),
            "issold" => ascending ? query.OrderBy(cl => cl.IsSold) : query.OrderByDescending(cl => cl.IsSold),
            "isspecialoffer" => ascending ? query.OrderBy(cl => cl.IsSpecialOffer) : query.OrderByDescending(cl => cl.IsSpecialOffer),
            _ => ascending ? query.OrderBy(cl => cl.StockNumber) : query.OrderByDescending(cl => cl.StockNumber)
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
