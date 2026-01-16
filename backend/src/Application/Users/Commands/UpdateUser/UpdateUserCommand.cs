using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;
using MyApp.Domain.Constants;

namespace MyApp.Application.Users.Commands.UpdateUser;

public record UpdateUserCommand : IRequest<UpdateUserResponse>
{
    public string Id { get; init; } = string.Empty;
    public string? Email { get; init; }
    public bool? EmailConfirmed { get; init; }
    public string? Role { get; init; }
}

public record UpdateUserResponse
{
    public string UserId { get; init; } = string.Empty;
    public bool Success { get; init; }
    public string[] Errors { get; init; } = Array.Empty<string>();
}

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UpdateUserResponse>
{
    private readonly IIdentityService _identityService;

    public UpdateUserCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<UpdateUserResponse> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var (result, userId) = await _identityService.UpdateUserAsync(
            request.Id,
            request.Email,
            request.EmailConfirmed,
            request.Role);

        return new UpdateUserResponse
        {
            UserId = userId,
            Success = result.Succeeded,
            Errors = result.Errors
        };
    }
}