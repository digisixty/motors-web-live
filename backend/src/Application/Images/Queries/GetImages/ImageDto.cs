namespace MyApp.Application.Images.Queries.GetImages;

public record ImageDto
{
    public int Id { get; init; }
    public string OriginalFileName { get; init; } = string.Empty;
    public string StoredFileName { get; init; } = string.Empty;
    public string RelativeUrl { get; init; } = string.Empty;
    public string AbsoluteUrl { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long FileSizeInBytes { get; init; }
    public string? FolderPath { get; init; }
    public string? Description { get; init; }
    public string? AltText { get; init; }
    public DateTimeOffset Created { get; init; }
    public string? CreatedBy { get; init; }
}