using System.Text.Json;
using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;

namespace MyApp.Application.Blogs.Queries.GetBlogsList;

public record GetBlogsListQuery : IRequest<PaginatedList<BlogListDto>>
{
    public int? PageNumber { get; init; } = 1;
    public int? PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public string? Title { get; init; }
    public string? Slug { get; init; }
}

public class GetBlogsListQueryHandler : IRequestHandler<GetBlogsListQuery, PaginatedList<BlogListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetBlogsListQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    private static object? TryParseJson(string? jsonString)
    {
        if (string.IsNullOrEmpty(jsonString))
            return null;

        try
        {
            return JsonSerializer.Deserialize<object>(jsonString);
        }
        catch
        {
            return null;
        }
    }

    public async Task<PaginatedList<BlogListDto>> Handle(GetBlogsListQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Blogs.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(b =>
                b.Title.Contains(request.Search) ||
                (b.ShortDescription != null && b.ShortDescription.Contains(request.Search)) ||
                b.Slug.Contains(request.Search));
        }

        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            query = query.Where(b => b.Title.Contains(request.Title));
        }

        if (!string.IsNullOrWhiteSpace(request.Slug))
        {
            query = query.Where(b => b.Slug.Contains(request.Slug));
        }

        // Apply projection
        var projectedQuery = query
            .Select(b => new BlogListDto
            {
                Id = b.Id,
                Title = b.Title,
                Slug = b.Slug,
                ShortDescription = b.ShortDescription,
                CoverImage = b.CoverImage,
                CoverImageAbsoluteUrl = !string.IsNullOrEmpty(b.CoverImage) ?
    Domain.Common.StaticConfiguration.GetAbsoluteUrl(b.CoverImage) : null,
                MetaTags = b.MetaTags,
                MetaTagsObject = !string.IsNullOrEmpty(b.MetaTags) ?
                    TryParseJson(b.MetaTags) : null,
                Created = b.Created,
                LastModified = b.LastModified
            })
            .OrderByDescending(b => b.Created);

        var pageNumber = request.PageNumber ?? 1;
        var pageSize = request.PageSize ?? 10;

        return await PaginatedList<BlogListDto>.CreateAsync(
            projectedQuery,
            pageNumber,
            pageSize,
            cancellationToken);
    }
}