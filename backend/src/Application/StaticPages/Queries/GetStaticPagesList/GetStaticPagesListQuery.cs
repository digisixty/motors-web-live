using System.Text.Json;
using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;

namespace MyApp.Application.StaticPages.Queries.GetStaticPagesList;

public record GetStaticPagesListQuery : IRequest<PaginatedList<StaticPageListDto>>
{
    public int? PageNumber { get; init; } = 1;
    public int? PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public string? Title { get; init; }
    public string? Slug { get; init; }
    public bool? IsPublished { get; init; }
}

public class GetStaticPagesListQueryHandler : IRequestHandler<GetStaticPagesListQuery, PaginatedList<StaticPageListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetStaticPagesListQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<StaticPageListDto>> Handle(GetStaticPagesListQuery request, CancellationToken cancellationToken)
    {
        var query = _context.StaticPages.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(p =>
                p.Title.Contains(request.Search) ||
                (p.Excerpt != null && p.Excerpt.Contains(request.Search)) ||
                (p.Content != null && p.Content.Contains(request.Search)) ||
                p.Slug.Contains(request.Search));
        }

        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            query = query.Where(p => p.Title.Contains(request.Title));
        }

        if (!string.IsNullOrWhiteSpace(request.Slug))
        {
            query = query.Where(p => p.Slug.Contains(request.Slug));
        }

        if (request.IsPublished.HasValue)
        {
            query = query.Where(p => p.IsPublished == request.IsPublished.Value);
        }

        // Apply projection
        var projectedQuery = query
            .Select(p => new StaticPageListDto
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Excerpt = p.Excerpt,
                CoverImage = p.CoverImage,
                IsPublished = p.IsPublished,
                MetaTitle = p.MetaTitle,
                MetaDescription = p.MetaDescription,
                MetaTags = p.MetaTags,
                MetaTagsObject = !string.IsNullOrEmpty(p.MetaTags) ?
                    JsonSerializer.Deserialize<object>(p.MetaTags) : null,
                Created = p.Created,
                LastModified = p.LastModified
            })
            .OrderByDescending(p => p.Created);

        return await PaginatedList<StaticPageListDto>.CreateAsync(
            projectedQuery,
            request.PageNumber ?? 1,
            request.PageSize ?? 10,
            cancellationToken);
    }
}