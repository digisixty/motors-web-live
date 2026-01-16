using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.StaticPages.Commands.CreateStaticPage;
using MyApp.Application.StaticPages.Commands.DeleteStaticPage;
using MyApp.Application.StaticPages.Commands.UpdateStaticPage;
using MyApp.Application.StaticPages.Queries.GetStaticPage;
using MyApp.Application.StaticPages.Queries.GetStaticPagesList;
using MyApp.Application.Common.Models;

namespace MyApp.Web.Endpoints.Admin.V1;

public class StaticPages : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetStaticPagesList).RequireAuthorization();
        groupBuilder.MapGet(GetStaticPage, "{id}").RequireAuthorization();
        groupBuilder.MapGet(GetStaticPageBySlug, "slug/{slug}").RequireAuthorization();
        groupBuilder.MapPost(CreateStaticPage).RequireAuthorization();
        groupBuilder.MapPut(UpdateStaticPage, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteStaticPage, "{id}").RequireAuthorization();
    }

    public async Task<Ok<PaginatedList<StaticPageListDto>>> GetStaticPagesList(
        ISender sender,
        int? pageNumber = 1,
        int? pageSize = 10,
        string? search = null,
        string? title = null,
        string? slug = null,
        bool? isPublished = null)
    {
        var staticPagesQuery = new GetStaticPagesListQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            Search = search,
            Title = title,
            Slug = slug,
            IsPublished = isPublished
        };

        var staticPages = await sender.Send(staticPagesQuery);

        return TypedResults.Ok(staticPages);
    }

    public async Task<Results<Ok<StaticPageDto>, NotFound>> GetStaticPage(ISender sender, int id)
    {
        var staticPage = await sender.Send(new GetStaticPageQuery { Id = id });

        if (staticPage == null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(staticPage);
    }

    public async Task<Results<Ok<StaticPageDto>, NotFound>> GetStaticPageBySlug(ISender sender, string slug)
    {
        var staticPage = await sender.Send(new GetStaticPageQuery { Slug = slug });

        if (staticPage == null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(staticPage);
    }

    public async Task<Created<int>> CreateStaticPage(ISender sender, CreateStaticPageCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/static-pages/{id}", id);
    }

    public async Task<Results<NoContent, NotFound>> UpdateStaticPage(ISender sender, int id, UpdateStaticPageCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();

        await sender.Send(command);

        return TypedResults.NoContent();
    }

    public async Task<Results<NoContent, NotFound>> DeleteStaticPage(ISender sender, int id)
    {
        await sender.Send(new DeleteStaticPageCommand { Id = id });

        return TypedResults.NoContent();
    }
}