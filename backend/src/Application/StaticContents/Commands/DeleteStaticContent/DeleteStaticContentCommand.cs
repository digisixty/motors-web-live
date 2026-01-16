using MediatR;

namespace MyApp.Application.StaticContents.Commands.DeleteStaticContent;

public record DeleteStaticContentCommand : IRequest
{
    public int Id { get; init; }
}
