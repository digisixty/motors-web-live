using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.StaticContents.Commands.CreateStaticContent;
using MyApp.Application.StaticContents.Commands.DeleteStaticContent;
using MyApp.Application.StaticContents.Commands.UpdateStaticContent;
using MyApp.Application.StaticContents.Queries.GetStaticContentsList;
using MyApp.Application.StaticContents.Queries.GetStaticContent;
using MyApp.Application.StaticContents.Common;
using MyApp.Application.Common.Models;

namespace MyApp.Web.Endpoints.Admin.V1;

public class StaticContents : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetStaticContents).RequireAuthorization().WithName("AdminGetStaticContents");
        groupBuilder.MapGet(GetStaticContentById, "{id}").RequireAuthorization().WithName("AdminGetStaticContentById");
        groupBuilder.MapPost(CreateStaticContent).RequireAuthorization();
        groupBuilder.MapPut(UpdateStaticContent, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteStaticContent, "{id}").RequireAuthorization();
    }

    /// <summary>
    /// Get static contents with optional filtering
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="pageNumber">Page number for pagination (default: 1)</param>
    /// <param name="pageSize">Number of items per page (default: 10)</param>
    /// <param name="title">Filter by title (contains match)</param>
    /// <param name="slug">Filter by slug (contains match)</param>
    /// <returns>Paginated list of static contents</returns>
    public async Task<Ok<PaginatedList<StaticContentDto>>> GetStaticContents(
        ISender sender,
        int? pageNumber = 1,
        int? pageSize = 10,
        string? title = null,
        string? slug = null)
    {
        var staticContentsQuery = new GetStaticContentsListQuery
        {
            PageNumber = pageNumber ?? 1,
            PageSize = pageSize ?? 10,
            Title = title,
            Slug = slug
        };

        var staticContents = await sender.Send(staticContentsQuery);

        return TypedResults.Ok(staticContents);
    }

    /// <summary>
    /// Get a static content by ID
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Static content ID</param>
    /// <returns>Static content details or 404 if not found</returns>
    public async Task<Results<Ok<StaticContentDto>, NotFound>> GetStaticContentById(ISender sender, int id)
    {
        var query = new GetStaticContentQuery { Id = id };
        var staticContent = await sender.Send(query);

        return staticContent is null ? TypedResults.NotFound() : TypedResults.Ok(staticContent);
    }

    /// <summary>
    /// Create a new static content
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="command">Create static content command</param>
    /// <returns>Created static content ID</returns>
    public async Task<Created<int>> CreateStaticContent(ISender sender, CreateStaticContentCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/static-contents/{id}", id);
    }

    /// <summary>
    /// Update an existing static content
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Static content ID</param>
    /// <param name="command">Update static content command</param>
    /// <returns>204 No content or 404 Not Found</returns>
    public async Task<Results<NoContent, NotFound>> UpdateStaticContent(ISender sender, int id, UpdateStaticContentCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();

        await sender.Send(command);

        return TypedResults.NoContent();
    }

    /// <summary>
    /// Delete a static content
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Static content ID</param>
    /// <returns>204 No content or 404 Not Found</returns>
    public async Task<Results<NoContent, NotFound>> DeleteStaticContent(ISender sender, int id)
    {
        try
        {
            await sender.Send(new DeleteStaticContentCommand { Id = id });
            return TypedResults.NoContent();
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }
}
