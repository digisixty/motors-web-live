using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.StaticPages.Commands.UpdateStaticPage;

[Authorize(Roles = Roles.Administrator)]
public record UpdateStaticPageCommand : IRequest
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Content { get; init; }
    public string? Excerpt { get; init; }
    public string? CoverImage { get; init; }
    public bool IsPublished { get; init; } = false;
    public string? MetaTitle { get; init; }
    public string? MetaDescription { get; init; }
    public List<string>? ImagesGallery { get; init; } = new();
    public List<string>? VideosGallery { get; init; } = new();
    public string? MetaTags { get; init; }
}

public class UpdateStaticPageCommandHandler : IRequestHandler<UpdateStaticPageCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateStaticPageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateStaticPageCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.StaticPages
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(StaticPage), request.Id.ToString());
        }

        entity.Title = request.Title;
        entity.Slug = request.Slug;
        entity.Content = request.Content;
        entity.Excerpt = request.Excerpt;
        entity.CoverImage = request.CoverImage;
        entity.IsPublished = request.IsPublished;
        entity.MetaTitle = request.MetaTitle;
        entity.MetaDescription = request.MetaDescription;
        entity.ImagesGallery = request.ImagesGallery;
        entity.VideosGallery = request.VideosGallery;
        entity.MetaTags = request.MetaTags;

        await _context.SaveChangesAsync(cancellationToken);
    }
}