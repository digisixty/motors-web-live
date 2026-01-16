using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.CarOptions.Queries.GetCarOptions;

namespace MyApp.Web.Endpoints.Public.V1;

public class CarOptions : EndpointGroupBase
{
    public override string? Scope => "V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCarOptions).WithName("PublicGetCarOptions");
    }

    /// <summary>
    /// Get car options hierarchy for public browsing
    /// </summary>
    /// <remarks>
    /// Retrieves a hierarchical list of car options available for filtering and browsing car listings.
    /// Options are organized in a tree structure with parent-child relationships.
    ///
    /// **Option Types:**
    /// - String (0): Text values like brand names, models
    /// - Number (1): Numeric values like year, mileage
    /// - Boolean (2): True/False values
    /// - Color (3): Color values with potential hex codes
    /// - List (4): Predefined list of options
    ///
    /// **Usage Examples:**
    /// - GET /api/V1/CarOptions (returns all root options with their children)
    /// - GET /api/V1/CarOptions?parentId=1 (returns specific option and its children)
    ///
    /// **Common Use Cases:**
    /// - Building filter dropdowns for car search
    /// - Displaying available car features and specifications
    /// - Creating faceted search interfaces
    /// </remarks>
    /// <param name="sender">MediatR sender</param>
    /// <param name="parentId">Optional parent ID to get specific option subtree</param>
    /// <returns>Hierarchical list of car options</returns>
    public async Task<Ok<List<CarOptionDto>>> GetCarOptions(
        ISender sender,
        int? parentId = null)
    {
        var query = new GetPublicCarOptionsQuery { ParentId = parentId };
        var carOptions = await sender.Send(query);

        return TypedResults.Ok(carOptions);
    }
}