using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.CarListings.Commands.CreateCarListing;
using MyApp.Application.CarListings.Commands.DeleteCarListing;
using MyApp.Application.CarListings.Commands.DuplicateCarListing;
using MyApp.Application.CarListings.Commands.UpdateCarListing;
using MyApp.Application.CarListings.Queries.GetCarListings;
using MyApp.Application.CarListings.Queries.GetCarListingById;
using MyApp.Application.CarListings.Common;
using MyApp.Application.Common.Models;

namespace MyApp.Web.Endpoints.Admin.V1;

public class CarListings : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCarListings).RequireAuthorization().WithName("AdminGetCarListings");
        groupBuilder.MapGet(GetCarListingById, "{id}").RequireAuthorization().WithName("AdminGetCarListingById");
        groupBuilder.MapPost(CreateCarListing).RequireAuthorization();
        groupBuilder.MapPost(DuplicateCarListing, "{id}/duplicate").RequireAuthorization();
        groupBuilder.MapPut(UpdateCarListing, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteCarListing, "{id}").RequireAuthorization();
    }

    /// <summary>
/// Get car listings with optional filtering
/// </summary>
/// <remarks>
/// Retrieves a paginated list of car listings. Supports filtering by various criteria including dynamic attribute filters.
///
/// **Attribute Filters:**
/// Use format: ?attribute[attributeId]=value
/// Examples:
/// - ?attribute[1]=red (filters where attribute with ID 1 contains 'red')
/// - ?attribute[2]=automatic (filters where attribute with ID 2 contains 'automatic')
/// - ?attribute[1]=red&amp;attribute[2]=automatic (combines multiple filters)
///
/// Where attributeId is the CarAttributeId and value is what to filter by (contains match).
/// </remarks>
/// <param name="sender">MediatR sender</param>
/// <param name="request">HTTP request for accessing query parameters including attribute filters</param>
/// <param name="pageNumber">Page number for pagination (default: 1)</param>
/// <param name="pageSize">Number of items per page (default: 10)</param>
/// <param name="vinNumber">Filter by VIN number (contains match)</param>
/// <param name="isSold">Filter by sold status (true/false)</param>
/// <param name="isSpecialOffer">Filter by special offer status (true/false)</param>
/// <param name="searchq">Search query to filter by multiple terms including stock number</param>
/// <returns>Paginated list of car listings</returns>
  public async Task<Ok<PaginatedList<CarListingDto>>> GetCarListings(
        ISender sender,
        HttpRequest request,
        int? pageNumber = 1,
        int? pageSize = 10,
        string? vinNumber = null,
        bool? isSold = null,
        bool? isSpecialOffer = null,
        string? searchq = null)
    {
        // Parse attribute filters from query parameters
        var attributeFilters = ParseAttributeFilters(request.Query);

        var carListingsQuery = new GetCarListingsQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            VinNumber = vinNumber,
            IsSold = isSold,
            IsSpecialOffer = isSpecialOffer,
            AttributeFilters = attributeFilters,
            SearchQuery = searchq
        };

        var carListings = await sender.Send(carListingsQuery);

        return TypedResults.Ok(carListings);
    }

    /// <summary>
    /// Get a car listing by ID
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Car listing ID</param>
    /// <returns>Car listing details or 404 if not found</returns>
    public async Task<Results<Ok<CarListingDto>, NotFound>> GetCarListingById(ISender sender, int id)
    {
        var query = new GetCarListingByIdQuery { Id = id };
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

    public async Task<Created<int>> CreateCarListing(ISender sender, CreateCarListingCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/car-listings/{id}", id);
    }

    public async Task<Results<NoContent, NotFound>> UpdateCarListing(ISender sender, int id, UpdateCarListingCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();

        await sender.Send(command);

        return TypedResults.NoContent();
    }

    public async Task<Results<Created<int>, NotFound>> DuplicateCarListing(ISender sender, int id)
    {
        try
        {
            var newId = await sender.Send(new DuplicateCarListingCommand { Id = id });
            return TypedResults.Created($"/car-listings/{newId}", newId);
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }

    public async Task<Results<NoContent, NotFound>> DeleteCarListing(ISender sender, int id)
    {
        await sender.Send(new DeleteCarListingCommand { Id = id });

        return TypedResults.NoContent();
    }
}
