namespace MyApp.Domain.Entities;

public class CarListingAttribute : BaseEntity
{
    public int CarListingId { get; set; }

    public CarListing CarListing { get; set; } = null!;

    public int CarAttributeId { get; set; }

    public CarAttribute CarAttribute { get; set; } = null!;

    public string? Value { get; set; }
}