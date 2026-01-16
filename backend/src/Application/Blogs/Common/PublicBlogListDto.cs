namespace MyApp.Application.Blogs.Common;

public record PublicBlogListDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? ShortDescription { get; init; }
    public string? CoverImage { get; init; }
    public string? CoverImageAbsoluteUrl { get; init; }
    public string? MetaTags { get; init; }
    public object? MetaTagsObject { get; init; }
    public DateTimeOffset Created { get; init; }
    public DateTimeOffset? LastModified { get; init; }
}