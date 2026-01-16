using MediatR;
using MyApp.Application.StaticContents.Common;

namespace MyApp.Application.StaticContents.Queries.GetStaticContentBySlug;

public record GetStaticContentBySlugQuery : IRequest<StaticContentDto?>
{
    public string Slug { get; init; } = string.Empty;
}
