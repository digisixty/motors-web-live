using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.Blogs.Commands.CreateBlog;
using MyApp.Application.Blogs.Commands.DeleteBlog;
using MyApp.Application.Blogs.Commands.UpdateBlog;
using MyApp.Application.Blogs.Queries.GetBlog;
using MyApp.Application.Blogs.Queries.GetBlogsList;
using MyApp.Application.Common.Models;

namespace MyApp.Web.Endpoints.Admin.V1;

public class Blogs : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetBlogsList).RequireAuthorization();
        groupBuilder.MapGet(GetBlog, "{id}").RequireAuthorization();
        groupBuilder.MapGet(GetBlogBySlug, "slug/{slug}").RequireAuthorization();
        groupBuilder.MapPost(CreateBlog).RequireAuthorization();
        groupBuilder.MapPut(UpdateBlog, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteBlog, "{id}").RequireAuthorization();
    }

    public async Task<Ok<PaginatedList<BlogListDto>>> GetBlogsList(
        ISender sender,
        int? pageNumber = 1,
        int? pageSize = 10,
        string? search = null,
        string? title = null,
        string? slug = null)
    {
        var blogsQuery = new GetBlogsListQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            Search = search,
            Title = title,
            Slug = slug
        };

        var blogs = await sender.Send(blogsQuery);

        return TypedResults.Ok(blogs);
    }

    public async Task<Results<Ok<BlogDto>, NotFound>> GetBlog(ISender sender, int id)
    {
        var blog = await sender.Send(new GetBlogQuery { Id = id });

        if (blog == null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(blog);
    }

    public async Task<Results<Ok<BlogDto>, NotFound>> GetBlogBySlug(ISender sender, string slug)
    {
        var blog = await sender.Send(new GetBlogQuery { Slug = slug });

        if (blog == null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(blog);
    }

    public async Task<Created<int>> CreateBlog(ISender sender, CreateBlogCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/blogs/{id}", id);
    }

    public async Task<Results<NoContent, NotFound>> UpdateBlog(ISender sender, int id, UpdateBlogCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();

        await sender.Send(command);

        return TypedResults.NoContent();
    }

    public async Task<Results<NoContent, NotFound>> DeleteBlog(ISender sender, int id)
    {
        await sender.Send(new DeleteBlogCommand { Id = id });

        return TypedResults.NoContent();
    }
}