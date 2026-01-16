using System.Text.Json;
using MediatR;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.StaticPages.Queries.GetStaticPage;

public record GetStaticPageQuery : IRequest<StaticPageDto?>
{
    public int? Id { get; init; }
    public string? Slug { get; init; }
}

public class GetStaticPageQueryHandler : IRequestHandler<GetStaticPageQuery, StaticPageDto?>
{
    private readonly IApplicationDbContext _context;

    public GetStaticPageQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StaticPageDto?> Handle(GetStaticPageQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Domain.Entities.StaticPage> query = _context.StaticPages;

        if (request.Id.HasValue)
        {
            query = query.Where(p => p.Id == request.Id.Value);
        }
        else if (!string.IsNullOrWhiteSpace(request.Slug))
        {
            query = query.Where(p => p.Slug == request.Slug);
        }
        else
        {
            return null;
        }

        return await query
            .Select(p => new StaticPageDto
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Content = p.Content,
                Excerpt = p.Excerpt,
                CoverImage = p.CoverImage,
                IsPublished = p.IsPublished,
                MetaTitle = p.MetaTitle,
                MetaDescription = p.MetaDescription,
                ImagesGallery = p.ImagesGallery,
                VideosGallery = p.VideosGallery,
                MetaTags = p.MetaTags,
                MetaTagsObject = !string.IsNullOrEmpty(p.MetaTags) ?
                    JsonSerializer.Deserialize<object>(p.MetaTags) : null,
                Created = p.Created,
                LastModified = p.LastModified
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}