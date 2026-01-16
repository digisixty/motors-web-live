using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.Blogs.Commands.UpdateBlog;

[Authorize(Roles = Roles.Administrator)]
public record UpdateBlogCommand : IRequest
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? ShortDescription { get; init; }
    public string? FullDescription { get; init; }
    public string? CoverImage { get; init; }
    public List<string>? ImagesGallery { get; init; } = new();
    public List<string>? VideosGallery { get; init; } = new();
    public string? MetaTags { get; init; }
}

public class UpdateBlogCommandHandler : IRequestHandler<UpdateBlogCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateBlogCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateBlogCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Blogs
            .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Blog), request.Id.ToString());
        }

        entity.Title = request.Title;
        entity.Slug = request.Slug;
        entity.ShortDescription = request.ShortDescription;
        entity.FullDescription = request.FullDescription;
        entity.CoverImage = request.CoverImage;
        entity.ImagesGallery = request.ImagesGallery;
        entity.VideosGallery = request.VideosGallery;
        entity.MetaTags = request.MetaTags;

        await _context.SaveChangesAsync(cancellationToken);
    }
}