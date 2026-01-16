using MyApp.Domain.Enums;

namespace MyApp.Application.Sliders.Common;

public record PublicSliderDto
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
}