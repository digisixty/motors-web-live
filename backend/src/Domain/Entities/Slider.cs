using MyApp.Domain.Enums;

namespace MyApp.Domain.Entities;

public class Slider : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;

    public string? ShortDescription { get; set; }

    public string? Image { get; set; }

    public bool IsEnabled { get; set; } = false;

    public string? BgColor { get; set; }

    public string? Video { get; set; }

    public SliderPlacement Placement { get; set; } = SliderPlacement.SpecialOffer;

    public int? CarId { get; set; }

    public CarListing? Car { get; set; }
}