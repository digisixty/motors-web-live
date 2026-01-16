using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.CarListings.Common;
using MyApp.Application.CarListings.Queries.GetCarListingBySlug;
using MyApp.Application.CarListings.Queries.GetCarListings;
using MyApp.Application.Common.Models;

namespace MyApp.Web.Endpoints.Public.V1;

public class CarListings : EndpointGroupBase
{
    public override string? Scope => "V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCarListings).WithName("PublicGetCarListings");
        groupBuilder.MapGet(GetCarListingBySlug, "{slug}").WithName("PublicGetCarListingBySlug");
    }

    /// <summary>
    /// Get car listings with optional filtering, sorting, and pagination
    /// </summary>
    /// <remarks>
    /// Retrieves a paginated list of car listings for public viewing. Supports filtering by various criteria including dynamic attribute filters, sorting, and pagination.
    ///
    /// **Attribute Filters:**
    /// Use format: ?attribute[attributeId]=value
    /// Examples:
    /// - ?attribute[1]=red (filters where attribute with ID 1 contains 'red')
    /// - ?attribute[2]=automatic (filters where attribute with ID 2 contains 'automatic')
    /// - ?attribute[1]=red&amp;attribute[2]=automatic (combines multiple filters)
    ///
    /// Where attributeId is the CarAttributeId and value is what to filter by (contains match).
    ///
    /// **Sorting:**
    /// Use ?sortBy=field&amp;sortDirection=asc|desc
    /// Supported fields: stockNumber, price, salePrice, registrationDate, manufacturerName, carModelName
    /// Default sort: stockNumber (ascending)
    ///
    /// **Examples:**
    /// - GET /api/V1/CarListings?pageNumber=1&amp;pageSize=20
    /// - GET /api/V1/CarListings?isSold=false&amp;sortBy=price&amp;sortDirection=asc
    /// - GET /api/V1/CarListings?isSpecialOffer=true&amp;pageSize=5
    /// - GET /api/V1/CarListings?attribute[1]=sedan&amp;attribute[2]=automatic
    /// </remarks>
    /// <param name="sender">MediatR sender</param>
    /// <param name="request">HTTP request for accessing query parameters including attribute filters</param>
    /// <param name="pageNumber">Page number for pagination (default: 1)</param>
    /// <param name="pageSize">Number of items per page (default: 10, max: 100)</param>
    /// <param name="isSold">Filter by sold status (true/false). Default: null (shows all)</param>
    /// <param name="isSpecialOffer">Filter by special offer status (true/false)</param>
    /// <param name="sortBy">Field to sort by (stockNumber, price, salePrice, registrationDate, manufacturerName, carModelName)</param>
    /// <param name="sortDirection">Sort direction (asc or desc). Default: asc</param>
    /// <param name="minPrice">Filter by minimum price</param>
    /// <param name="maxPrice">Filter by maximum price</param>
    /// <param name="manufacturerId">Filter by manufacturer ID</param>
    /// <param name="carModelId">Filter by car model ID</param>
    /// <param name="searchq">Search query to filter by multiple terms including stock number</param>
    /// <returns>Paginated list of car listings</returns>
    public async Task<Ok<PaginatedList<PublicCarListingDto>>> GetCarListings(
        ISender sender,
        HttpRequest request,
        int? pageNumber = 1,
        int? pageSize = 10,
                bool? isSold = null,
        bool? isSpecialOffer = null,
        string? sortBy = "stockNumber",
        string? sortDirection = "asc",
        decimal? minPrice = null,
        decimal? maxPrice = null,
        int? manufacturerId = null,
        int? carModelId = null,
        string? searchq = null)
    {
        // Validate and limit page size for performance
        if (pageSize.HasValue && (pageSize.Value <= 0 || pageSize.Value > 100))
        {
            pageSize = 10;
        }

        // Parse attribute filters from query parameters
        var attributeFilters = ParseAttributeFilters(request.Query);

        var carListingsQuery = new GetPublicCarListingsQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            IsSold = isSold,
            IsSpecialOffer = isSpecialOffer,
            AttributeFilters = attributeFilters,
            SortBy = sortBy?.ToLowerInvariant(),
            SortDirection = sortDirection?.ToLowerInvariant() ?? "asc",
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            ManufacturerId = manufacturerId,
            CarModelId = carModelId,
            SearchQuery = searchq
        };

        var carListings = await sender.Send(carListingsQuery);

        return TypedResults.Ok(carListings);
    }

    /// <summary>
    /// Get a car listing by slug
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="slug">Car listing slug</param>
    /// <returns>Car listing details or 404 if not found</returns>
    public async Task<Results<Ok<PublicCarListingDto>, NotFound>> GetCarListingBySlug(ISender sender, string slug)
    {
        var query = new GetPublicCarListingBySlugQuery { Slug = slug };
        var carListing = await sender.Send(query);

        return carListing is null ? TypedResults.NotFound() : TypedResults.Ok(carListing);
    }

    private static Dictionary<int, string>? ParseAttributeFilters(IQueryCollection query)
    {
        var attributeFilters = new Dictionary<int, string>();

        // Look for query parameters that match the pattern "attribute[id]"
        foreach (var key in query.Keys)
        {
            if (key.StartsWith("attribute[") && key.EndsWith(']'))
            {
                // Extract the attribute ID from "attribute[id]"
                var idString = key[10..^1]; // Remove "attribute[" and "]"

                if (int.TryParse(idString, out var attributeId))
                {
                    var value = query[key];
                    if (!string.IsNullOrEmpty(value))
                    {
                        attributeFilters[attributeId] = value.ToString();
                    }
                }
            }
        }

        return attributeFilters.Count > 0 ? attributeFilters : null;
    }
}
