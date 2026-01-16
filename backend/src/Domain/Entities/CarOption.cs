using MyApp.Domain.Enums;

namespace MyApp.Domain.Entities;

public class CarOption : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public string? Image { get; set; }
    public string? Icon { get; set; }
    public string? Description { get; set; }
    public CarOptionType Type { get; set; }
    public CarOption? Parent { get; set; }
    public ICollection<CarOption> Children { get; private set; } = new List<CarOption>();
}