using MyApp.Domain.Enums;

namespace MyApp.Application.CarAttributes.Queries.GetCarAttributes;

public record CarAttributeDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public int? ParentId { get; init; }
    public string? Image { get; init; }
    public string? Icon { get; init; }
    public string? Description { get; init; }
    public CarAttributeType Type { get; init; }
    public List<CarAttributeDto> Children { get; init; } = new();
    public string? AbsoluteImageUrl { get; init; }
    public string? AbsoluteIconUrl { get; init; }
}