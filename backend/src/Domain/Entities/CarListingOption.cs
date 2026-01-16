namespace MyApp.Domain.Entities;

public class CarListingOption : BaseEntity
{
    public int CarListingId { get; set; }
    public CarListing CarListing { get; set; } = null!;
    public int CarOptionId { get; set; }
    public CarOption CarOption { get; set; } = null!;
    public string? Value { get; set; }
}