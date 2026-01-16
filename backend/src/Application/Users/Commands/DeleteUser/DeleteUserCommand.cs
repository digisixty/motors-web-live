using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;

namespace MyApp.Application.Users.Commands.DeleteUser;

public record DeleteUserCommand : IRequest<DeleteUserResponse>
{
    public string Id { get; init; } = string.Empty;
}

public record DeleteUserResponse
{
    public bool Success { get; init; }
    public string[] Errors { get; init; } = Array.Empty<string>();
}

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, DeleteUserResponse>
{
    private readonly IIdentityService _identityService;

    public DeleteUserCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<DeleteUserResponse> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var result = await _identityService.DeleteUserAsync(request.Id);

        return new DeleteUserResponse
        {
            Success = result.Succeeded,
            Errors = result.Errors
        };
    }
}