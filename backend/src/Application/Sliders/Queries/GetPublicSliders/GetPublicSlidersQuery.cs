using MediatR;
using MyApp.Application.Sliders.Common;
using MyApp.Domain.Enums;

namespace MyApp.Application.Sliders.Queries.GetPublicSliders;

public record GetPublicSlidersQuery : IRequest<List<PublicSliderDto>>
{
    public SliderPlacement? Placement { get; init; }
}