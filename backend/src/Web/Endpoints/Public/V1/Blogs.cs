using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.Blogs.Common;
using MyApp.Application.Blogs.Queries.GetPublicBlog;
using MyApp.Application.Blogs.Queries.GetPublicBlogs;
using MyApp.Application.Common.Models;

namespace MyApp.Web.Endpoints.Public.V1;

public class Blogs : EndpointGroupBase
{
    public override string? Scope => "V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetBlogs).WithName("PublicGetBlogs");
        groupBuilder.MapGet(GetBlogById, "{id}").WithName("PublicGetBlogById");
        groupBuilder.MapGet(GetBlogBySlug, "slug/{slug}").WithName("PublicGetBlogBySlug");
    }

    /// <summary>
    /// Get blog posts with optional search, sorting, and pagination
    /// </summary>
    /// <remarks>
    /// Retrieves a paginated list of blog posts for public viewing. Supports search functionality and sorting.
    ///
    /// **Search:**
    /// Searches across blog title, short description, and slug fields.
    ///
    /// **Sorting:**
    /// Use ?sortBy=field&amp;sortDirection=asc|desc
    /// Supported fields: created, title, slug, lastModified
    /// Default sort: created (descending)
    ///
    /// **Examples:**
    /// - GET /api/V1/Blogs?pageNumber=1&amp;pageSize=10
    /// - GET /api/V1/Blogs?search=tutorial&amp;sortBy=title&amp;sortDirection=asc
    /// - GET /api/V1/Blogs?pageSize=5&amp;sortBy=created&amp;sortDirection=desc
    /// </remarks>
    /// <param name="sender">MediatR sender</param>
    /// <param name="pageNumber">Page number for pagination (default: 1)</param>
    /// <param name="pageSize">Number of items per page (default: 10, max: 100)</param>
    /// <param name="search">Search term to filter blogs</param>
    /// <param name="sortBy">Field to sort by (created, title, slug, lastModified)</param>
    /// <param name="sortDirection">Sort direction (asc or desc). Default: desc</param>
    /// <returns>Paginated list of blog posts</returns>
    public async Task<Ok<PaginatedList<PublicBlogListDto>>> GetBlogs(
        ISender sender,
        int? pageNumber = 1,
        int? pageSize = 10,
        string? search = null,
        string? sortBy = "created",
        string? sortDirection = "desc")
    {
        // Validate and limit page size for performance
        if (pageSize.HasValue && (pageSize.Value <= 0 || pageSize.Value > 100))
        {
            pageSize = 10;
        }

        var blogsQuery = new GetPublicBlogsQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            Search = search,
            SortBy = sortBy?.ToLowerInvariant(),
            SortDirection = sortDirection?.ToLowerInvariant() ?? "desc"
        };

        var blogs = await sender.Send(blogsQuery);

        return TypedResults.Ok(blogs);
    }

    /// <summary>
    /// Get a blog post by ID
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Blog post ID</param>
    /// <returns>Blog post details or 404 if not found</returns>
    public async Task<Results<Ok<PublicBlogDto>, NotFound>> GetBlogById(ISender sender, int id)
    {
        var query = new GetPublicBlogQuery { Id = id };
        var blog = await sender.Send(query);

        return blog is null ? TypedResults.NotFound() : TypedResults.Ok(blog);
    }

    /// <summary>
    /// Get a blog post by slug
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="slug">Blog post slug (URL-friendly identifier)</param>
    /// <returns>Blog post details or 404 if not found</returns>
    public async Task<Results<Ok<PublicBlogDto>, NotFound>> GetBlogBySlug(ISender sender, string slug)
    {
        var query = new GetPublicBlogQuery { Slug = slug };
        var blog = await sender.Send(query);

        return blog is null ? TypedResults.NotFound() : TypedResults.Ok(blog);
    }
}