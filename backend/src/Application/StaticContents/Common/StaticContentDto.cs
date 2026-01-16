namespace MyApp.Application.StaticContents.Common;

public record StaticContentDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? MainImage { get; init; }
    public string? MainImageAbsoluteUrl { get; set; }
    public string Description { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public DateTimeOffset Created { get; init; }
    public string? CreatedBy { get; init; }
    public DateTimeOffset LastModified { get; init; }
    public string? LastModifiedBy { get; init; }
}
