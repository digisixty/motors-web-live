using MediatR;
using MyApp.Application.Common.Models;
using MyApp.Application.Sliders.Common;
using MyApp.Domain.Enums;

namespace MyApp.Application.Sliders.Queries.GetSlidersList;

public record GetSlidersListQuery : IRequest<PaginatedList<SliderDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public string? Title { get; init; }
    public bool? IsEnabled { get; init; }
    public SliderPlacement? Placement { get; init; }
}