using MyApp.Domain.Enums;

namespace MyApp.Application.CarOptions.Queries.GetCarOptions;

public record CarOptionDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public int? ParentId { get; init; }
    public string? Image { get; init; }
    public string? Icon { get; init; }
    public string? Description { get; init; }
    public CarOptionType Type { get; init; }
    public List<CarOptionDto> Children { get; init; } = new();
}