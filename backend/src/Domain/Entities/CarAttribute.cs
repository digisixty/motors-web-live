using MyApp.Domain.Enums;

namespace MyApp.Domain.Entities;

public class CarAttribute : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public int? ParentId { get; set; }

    public string? Image { get; set; }

    public string? Icon { get; set; }

    public string? Description { get; set; }

    public CarAttributeType Type { get; set; }

    public CarAttribute? Parent { get; set; }

    public ICollection<CarAttribute> Children { get; private set; } = new List<CarAttribute>();
}