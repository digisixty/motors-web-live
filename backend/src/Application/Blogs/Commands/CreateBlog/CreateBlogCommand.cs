using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.Blogs.Commands.CreateBlog;

[Authorize(Roles = Roles.Administrator)]
public record CreateBlogCommand : IRequest<int>
{
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? ShortDescription { get; init; }
    public string? FullDescription { get; init; }
    public string? CoverImage { get; init; }
    public List<string>? ImagesGallery { get; init; } = new();
    public List<string>? VideosGallery { get; init; } = new();
    public string? MetaTags { get; init; }
}

public class CreateBlogCommandHandler : IRequestHandler<CreateBlogCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateBlogCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateBlogCommand request, CancellationToken cancellationToken)
    {
        var entity = new Blog
        {
            Title = request.Title,
            Slug = request.Slug,
            ShortDescription = request.ShortDescription,
            FullDescription = request.FullDescription,
            CoverImage = request.CoverImage,
            ImagesGallery = request.ImagesGallery,
            VideosGallery = request.VideosGallery,
            MetaTags = request.MetaTags
        };

        _context.Blogs.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}