using MediatR;
using MyApp.Application.Sliders.Common;
using MyApp.Domain.Enums;

namespace MyApp.Application.Sliders.Commands.CreateSlider;

public record CreateSliderCommand : IRequest<int>
{
    public string Title { get; init; } = string.Empty;
    public string? ShortDescription { get; init; }
    public string? Image { get; init; }
    public bool IsEnabled { get; init; } = false;
    public string? BgColor { get; init; }
    public string? Video { get; init; }
    public SliderPlacement Placement { get; init; } = SliderPlacement.SpecialOffer;
    public int? CarId { get; init; }
}