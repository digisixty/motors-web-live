using MyApp.Domain.Enums;

namespace MyApp.Application.Sliders.Common;

public record SliderDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? ShortDescription { get; init; }
    public string? Image { get; init; }
    public string? ImageAbsoluteUrl { get; set; }
    public bool IsEnabled { get; init; }
    public string? BgColor { get; init; }
    public string? Video { get; init; }
    public string? VideoAbsoluteUrl { get; set; }
    public SliderPlacement Placement { get; init; }
    public int? CarId { get; init; }
    public CarDto? Car { get; init; }
    public DateTimeOffset Created { get; init; }
    public string? CreatedBy { get; init; }
    public DateTimeOffset LastModified { get; init; }
    public string? LastModifiedBy { get; init; }
}

public record CarDto
{
    public int Id { get; init; }
    public string StockNumber { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? PrimaryImage { get; init; }
    public string? PrimaryImageAbsoluteUrl { get; set; }
    public decimal? Price { get; init; }
    public decimal? SalePrice { get; init; }
    public string? ManufacturerName { get; init; }
    public string? CarModelName { get; init; }
}