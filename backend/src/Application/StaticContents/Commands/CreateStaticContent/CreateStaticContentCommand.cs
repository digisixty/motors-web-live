using MediatR;

namespace MyApp.Application.StaticContents.Commands.CreateStaticContent;

public record CreateStaticContentCommand : IRequest<int>
{
    public string Title { get; init; } = string.Empty;
    public string? MainImage { get; init; }
    public string Description { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
}
