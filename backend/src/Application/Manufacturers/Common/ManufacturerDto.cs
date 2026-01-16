namespace MyApp.Application.Manufacturers.Common;

public record ManufacturerDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Logo { get; init; }
    public string? LogoAbsoluteUrl { get; init; }
}