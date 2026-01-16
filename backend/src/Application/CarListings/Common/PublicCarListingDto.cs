namespace MyApp.Application.CarListings.Common;

public record PublicCarListingDto
{
    public int Id { get; init; }
    public string StockNumber { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public DateTimeOffset? RegistrationDate { get; init; }
    public string? PrimaryImage { get; init; }
    public string? PrimaryImageAbsoluteUrl { get; init; }
    public string? InteriorImages { get; init; }
    public List<string> AbsoluteInteriorImages { get; init; } = new();
    public string? ExteriorImages { get; init; }
    public List<string> AbsoluteExteriorImages { get; init; } = new();
    public string? Videos { get; init; }
    public List<string> AbsoluteVideos { get; init; } = new();
    public decimal? Price { get; init; }
    public decimal? SalePrice { get; init; }
    public bool IsSold { get; init; }
    public string? CustomPriceLabel { get; init; }
    public string? CardFooterLabel { get; init; }
    public bool IsSpecialOffer { get; init; }
    public string? Description { get; init; }
    public int? ManufacturerId { get; init; }
    public string? ManufacturerName { get; init; }
    public int? CarModelId { get; init; }
    public string? CarModelName { get; init; }
    public string? MetaTags { get; init; }
    public object? MetaTagsObject { get; init; }
    public List<CarListingAttributeDto> CarListingAttributes { get; init; } = new();
    public List<CarListingOptionDto> CarListingOptions { get; init; } = new();
}