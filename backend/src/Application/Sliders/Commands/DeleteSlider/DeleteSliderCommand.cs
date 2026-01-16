using MediatR;

namespace MyApp.Application.Sliders.Commands.DeleteSlider;

public record DeleteSliderCommand : IRequest
{
    public int Id { get; init; }
}