namespace MyApp.Application.CarListings.Common;

public record CarListingDto
{
    public int Id { get; init; }
    public string StockNumber { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? VinNumber { get; init; }
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

public record CarListingAttributeDto
{
    public int Id { get; init; }
    public int CarAttributeId { get; init; }
    public string CarAttributeName { get; init; } = string.Empty;
    public string CarAttributeSlug { get; init; } = string.Empty;
    public int? CarAttributeParentId { get; init; }
    public string? Value { get; init; }
    public string? CarAttributeDescription { get; init; }
    public string? ImageAbsoluteUrl { get; init; }
    public string? IconAbsoluteUrl { get; init; }
}

public record CarListingOptionDto
{
    public int CarOptionId { get; init; }
    public string CarOptionName { get; init; } = string.Empty;
    public string CarOptionSlug { get; init; } = string.Empty;
    public int? CarOptionParentId { get; init; }
    public string? Value { get; init; }
    public MyApp.Domain.Enums.CarOptionType CarOptionType { get; init; }
}
