using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.StaticPages.Commands.CreateStaticPage;

[Authorize(Roles = Roles.Administrator)]
public record CreateStaticPageCommand : IRequest<int>
{
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

public class CreateStaticPageCommandHandler : IRequestHandler<CreateStaticPageCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateStaticPageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateStaticPageCommand request, CancellationToken cancellationToken)
    {
        var entity = new StaticPage
        {
            Title = request.Title,
            Slug = request.Slug,
            Content = request.Content,
            Excerpt = request.Excerpt,
            CoverImage = request.CoverImage,
            IsPublished = request.IsPublished,
            MetaTitle = request.MetaTitle,
            MetaDescription = request.MetaDescription,
            ImagesGallery = request.ImagesGallery,
            VideosGallery = request.VideosGallery,
            MetaTags = request.MetaTags
        };

        _context.StaticPages.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}