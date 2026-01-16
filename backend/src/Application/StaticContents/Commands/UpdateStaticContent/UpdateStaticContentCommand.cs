using MediatR;

namespace MyApp.Application.StaticContents.Commands.UpdateStaticContent;

public record UpdateStaticContentCommand : IRequest
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? MainImage { get; init; }
    public string Description { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
}
