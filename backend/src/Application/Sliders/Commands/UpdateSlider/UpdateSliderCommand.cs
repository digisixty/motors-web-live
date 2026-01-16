using MediatR;
using MyApp.Domain.Enums;

namespace MyApp.Application.Sliders.Commands.UpdateSlider;

public record UpdateSliderCommand : IRequest
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? ShortDescription { get; init; }
    public string? Image { get; init; }
    public bool IsEnabled { get; init; }
    public string? BgColor { get; init; }
    public string? Video { get; init; }
    public SliderPlacement Placement { get; init; } = SliderPlacement.SpecialOffer;
    public int? CarId { get; init; }
}