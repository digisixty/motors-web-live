namespace MyApp.Domain.Entities;

public class Manufacturer : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Logo { get; set; }

    public ICollection<CarModel> CarModels { get; private set; } = new List<CarModel>();
}