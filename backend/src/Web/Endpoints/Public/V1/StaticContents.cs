using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.StaticContents.Queries.GetStaticContentBySlug;
using MyApp.Application.StaticContents.Common;

namespace MyApp.Web.Endpoints.Public.V1;

public class StaticContents : EndpointGroupBase
{
    public override string? Scope => "V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetStaticContentBySlug, "{slug}").WithName("PublicGetStaticContentBySlug");
    }

    /// <summary>
    /// Get static content by slug for public display
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="slug">Static content slug</param>
    /// <returns>Static content details or 404 if not found</returns>
    public async Task<Results<Ok<StaticContentDto>, NotFound>> GetStaticContentBySlug(ISender sender, string slug)
    {
        var query = new GetStaticContentBySlugQuery { Slug = slug };
        var staticContent = await sender.Send(query);

        return staticContent is null ? TypedResults.NotFound() : TypedResults.Ok(staticContent);
    }
}
