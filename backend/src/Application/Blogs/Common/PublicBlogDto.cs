namespace MyApp.Application.Blogs.Common;

public record PublicBlogDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? ShortDescription { get; init; }
    public string? FullDescription { get; init; }
    public string? CoverImage { get; init; }
    public string? CoverImageAbsoluteUrl { get; init; }
    public List<string>? ImagesGallery { get; init; } = new();
    public List<string>? ImagesGalleryAbsoluteUrls { get; init; } = new();
    public List<string>? VideosGallery { get; init; } = new();
    public List<string>? VideosGalleryAbsoluteUrls { get; init; } = new();
    public string? MetaTags { get; init; }
    public object? MetaTagsObject { get; init; }
    public DateTimeOffset Created { get; init; }
    public DateTimeOffset? LastModified { get; init; }
}