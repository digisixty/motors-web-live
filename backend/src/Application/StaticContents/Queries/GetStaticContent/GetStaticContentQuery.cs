using MediatR;
using MyApp.Application.StaticContents.Common;

namespace MyApp.Application.StaticContents.Queries.GetStaticContent;

public record GetStaticContentQuery : IRequest<StaticContentDto?>
{
    public int Id { get; init; }
}
