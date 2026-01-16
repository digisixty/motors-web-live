using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.Sliders.Queries.GetPublicSliders;
using MyApp.Application.Sliders.Common;
using MyApp.Domain.Enums;

namespace MyApp.Web.Endpoints.Public.V1;

public class Sliders : EndpointGroupBase
{
    public override string? Scope => "V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetSliders).WithName("PublicGetSliders");
    }

    /// <summary>
    /// Get all enabled sliders for public display
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="placement">Optional slider placement filter</param>
    /// <returns>List of enabled sliders</returns>
    public async Task<Ok<List<PublicSliderDto>>> GetSliders(ISender sender, SliderPlacement? placement = null)
    {
        var slidersQuery = new GetPublicSlidersQuery { Placement = placement };
        var sliders = await sender.Send(slidersQuery);

        return TypedResults.Ok(sliders);
    }
}