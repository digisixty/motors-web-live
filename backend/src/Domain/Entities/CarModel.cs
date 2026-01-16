namespace MyApp.Domain.Entities;

public class CarModel : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? Image { get; set; }

    public int ManufacturerId { get; set; }

    public Manufacturer Manufacturer { get; set; } = null!;
}