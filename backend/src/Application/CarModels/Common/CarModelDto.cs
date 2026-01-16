namespace MyApp.Application.CarModels.Common;

public record CarModelDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Image { get; init; }
    public string? ImageAbsoluteUrl { get; init; }
    public int ManufacturerId { get; init; }
    public string ManufacturerName { get; init; } = string.Empty;
}