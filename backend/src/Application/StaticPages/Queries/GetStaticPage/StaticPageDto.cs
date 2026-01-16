namespace MyApp.Application.StaticPages.Queries.GetStaticPage;

public record StaticPageDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Content { get; init; }
    public string? Excerpt { get; init; }
    public string? CoverImage { get; init; }
    public bool IsPublished { get; init; }
    public string? MetaTitle { get; init; }
    public string? MetaDescription { get; init; }
    public List<string>? ImagesGallery { get; init; } = new();
    public List<string>? VideosGallery { get; init; } = new();
    public string? MetaTags { get; init; }
    public object? MetaTagsObject { get; init; }
    public DateTimeOffset Created { get; init; }
    public DateTimeOffset? LastModified { get; init; }
}