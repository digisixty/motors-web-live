using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.CarAttributes.Queries.GetCarAttributes;

namespace MyApp.Web.Endpoints.Public.V1;

public class CarAttributes : EndpointGroupBase
{
    public override string? Scope => "V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCarAttributes).WithName("PublicGetCarAttributes");
    }

    /// <summary>
    /// Get car attributes hierarchy for public browsing
    /// </summary>
    /// <remarks>
    /// Retrieves a hierarchical list of car attributes available for filtering and browsing car listings.
    /// Attributes are organized in a tree structure with parent-child relationships.
    ///
    /// **Attribute Types:**
    /// - String (0): Text values like brand names, models
    /// - Number (1): Numeric values like year, mileage
    /// - Boolean (2): True/False values
    /// - Color (3): Color values with potential hex codes
    /// - List (4): Predefined list of options
    ///
    /// **Usage Examples:**
    /// - GET /api/V1/CarAttributes (returns all root attributes with their children)
    /// - GET /api/V1/CarAttributes?parentId=1 (returns specific attribute and its children)
    ///
    /// **Common Use Cases:**
    /// - Building filter dropdowns for car search
    /// - Displaying available car features and specifications
    /// - Creating faceted search interfaces
    /// </remarks>
    /// <param name="sender">MediatR sender</param>
    /// <param name="parentId">Optional parent ID to get specific attribute subtree</param>
    /// <returns>Hierarchical list of car attributes</returns>
    public async Task<Ok<List<CarAttributeDto>>> GetCarAttributes(
        ISender sender,
        int? parentId = null)
    {
        var query = new GetPublicCarAttributesQuery { ParentId = parentId };
        var carAttributes = await sender.Send(query);

        return TypedResults.Ok(carAttributes);
    }
}