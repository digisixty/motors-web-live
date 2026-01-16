using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MediatR;
using MyApp.Application.Blogs.Common;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;

namespace MyApp.Application.Blogs.Queries.GetPublicBlogs;

public record GetPublicBlogsQuery : IRequest<PaginatedList<PublicBlogListDto>>
{
    public int? PageNumber { get; init; } = 1;
    public int? PageSize { get; init; } = 10;

    // Search parameter
    public string? Search { get; init; }

    // Sorting parameters
    public string? SortBy { get; init; } = "created";
    public string? SortDirection { get; init; } = "desc";
}

public class GetPublicBlogsQueryHandler : IRequestHandler<GetPublicBlogsQuery, PaginatedList<PublicBlogListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPublicBlogsQueryHandler(IApplicationDbContext context)
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

    public async Task<PaginatedList<PublicBlogListDto>> Handle(GetPublicBlogsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Blogs.AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLowerInvariant();
            query = query.Where(b =>
                b.Title.ToLower().Contains(searchLower) ||
                (b.ShortDescription != null && b.ShortDescription.ToLower().Contains(searchLower)) ||
                b.Slug.ToLower().Contains(searchLower));
        }

        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDirection);

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply pagination and get the data
        var pageNumber = request.PageNumber ?? 1;
        var pageSize = request.PageSize ?? 10;
        
        var blogs = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        // Map to DTOs
        var dtos = blogs.Select(b => new PublicBlogListDto
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
        }).ToList();

        return new PaginatedList<PublicBlogListDto>(dtos, totalCount, pageNumber, pageSize);
    }

    private static IQueryable<Domain.Entities.Blog> ApplySorting(IQueryable<Domain.Entities.Blog> query, string? sortBy, string? sortDirection)
    {
        var ascending = sortDirection?.ToLowerInvariant() != "desc";

        return sortBy?.ToLowerInvariant() switch
        {
            "title" => ascending ? query.OrderBy(b => b.Title) : query.OrderByDescending(b => b.Title),
            "slug" => ascending ? query.OrderBy(b => b.Slug) : query.OrderByDescending(b => b.Slug),
            "lastmodified" => ascending ? query.OrderBy(b => b.LastModified) : query.OrderByDescending(b => b.LastModified),
            _ => ascending ? query.OrderBy(b => b.Created) : query.OrderByDescending(b => b.Created)
        };
    }
}