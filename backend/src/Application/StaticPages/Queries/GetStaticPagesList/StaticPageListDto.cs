namespace MyApp.Application.StaticPages.Queries.GetStaticPagesList;

public record StaticPageListDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Excerpt { get; init; }
    public string? CoverImage { get; init; }
    public bool IsPublished { get; init; }
    public string? MetaTitle { get; init; }
    public string? MetaDescription { get; init; }
    public string? MetaTags { get; init; }
    public object? MetaTagsObject { get; init; }
    public DateTimeOffset Created { get; init; }
    public DateTimeOffset? LastModified { get; init; }
}