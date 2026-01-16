using MediatR;
using MyApp.Application.Common.Models;
using MyApp.Application.StaticContents.Common;

namespace MyApp.Application.StaticContents.Queries.GetStaticContentsList;

public record GetStaticContentsListQuery : IRequest<PaginatedList<StaticContentDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public string? Title { get; init; }
    public string? Slug { get; init; }
}
