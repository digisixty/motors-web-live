using System.Text.Json;
using MediatR;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.Blogs.Queries.GetBlog;

public record GetBlogQuery : IRequest<BlogDto?>
{
    public int? Id { get; init; }
    public string? Slug { get; init; }
}

public class GetBlogQueryHandler : IRequestHandler<GetBlogQuery, BlogDto?>
{
    private readonly IApplicationDbContext _context;

    public GetBlogQueryHandler(IApplicationDbContext context)
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

    public async Task<BlogDto?> Handle(GetBlogQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Domain.Entities.Blog> query = _context.Blogs;

        if (request.Id.HasValue)
        {
            query = query.Where(b => b.Id == request.Id.Value);
        }
        else if (!string.IsNullOrWhiteSpace(request.Slug))
        {
            query = query.Where(b => b.Slug == request.Slug);
        }
        else
        {
            return null;
        }

        return await query
            .Select(b => new BlogDto
            {
                Id = b.Id,
                Title = b.Title,
                Slug = b.Slug,
                ShortDescription = b.ShortDescription,
                FullDescription = b.FullDescription,
                CoverImage = b.CoverImage,
                CoverImageAbsoluteUrl = !string.IsNullOrEmpty(b.CoverImage) ?
    Domain.Common.StaticConfiguration.GetAbsoluteUrl(b.CoverImage) : null,
                ImagesGallery = b.ImagesGallery,
                ImagesGalleryAbsoluteUrls = ConvertToAbsoluteUrls(b.ImagesGallery),
                VideosGallery = b.VideosGallery,
                VideosGalleryAbsoluteUrls = ConvertToAbsoluteUrls(b.VideosGallery),
                MetaTags = b.MetaTags,
                MetaTagsObject = !string.IsNullOrEmpty(b.MetaTags) ?
                    TryParseJson(b.MetaTags) : null,
                Created = b.Created,
                LastModified = b.LastModified
            })
            .FirstOrDefaultAsync(cancellationToken);
    }

    private static List<string> ConvertToAbsoluteUrls(List<string>? urls)
    {
        if (urls == null || !urls.Any())
            return new List<string>();

        return urls
            .Where(url => !string.IsNullOrEmpty(url))
            .Select(Domain.Common.StaticConfiguration.GetAbsoluteUrl)
            .ToList();
    }
}