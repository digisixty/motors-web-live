using MediatR;
using MyApp.Application.Sliders.Common;

namespace MyApp.Application.Sliders.Queries.GetSlider;

public record GetSliderQuery : IRequest<SliderDto?>
{
    public int Id { get; init; }
}