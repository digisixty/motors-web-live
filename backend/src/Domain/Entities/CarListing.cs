using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Domain.Entities;

public class CarListing : BaseAuditableEntity
{
    public string StockNumber { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? VinNumber { get; set; }

    public DateTimeOffset? RegistrationDate { get; set; }

    public string? PrimaryImage { get; set; }

    public string? InteriorImages { get; set; }

    public string? ExteriorImages { get; set; }

    public string? Videos { get; set; }

    public decimal? Price { get; set; }

    public decimal? SalePrice { get; set; }

    public bool IsSold { get; set; }

    public string? CustomPriceLabel { get; set; }

    public string? CardFooterLabel { get; set; }

    public bool IsSpecialOffer { get; set; }

    public string? Description { get; set; }

    public int? ManufacturerId { get; set; }

    public int? CarModelId { get; set; }

    public Manufacturer? Manufacturer { get; set; }

    public CarModel? CarModel { get; set; }

    public ICollection<CarListingAttribute> CarListingAttributes { get; private set; } = new List<CarListingAttribute>();

    public ICollection<CarListingOption> CarListingOptions { get; private set; } = new List<CarListingOption>();

    private string? _metaTags;

    public string? MetaTags
    {
        get => _metaTags;
        set => _metaTags = value;
    }

    [NotMapped]
    public object? MetaTagsObject
    {
        get
        {
            if (string.IsNullOrEmpty(_metaTags))
                return null;

            try
            {
                return System.Text.Json.JsonSerializer.Deserialize<object>(_metaTags);
            }
            catch
            {
                return null;
            }
        }
        set
        {
            if (value == null)
            {
                _metaTags = null;
                return;
            }

            try
            {
                _metaTags = System.Text.Json.JsonSerializer.Serialize(value);
            }
            catch
            {
                _metaTags = null;
            }
        }
    }
}