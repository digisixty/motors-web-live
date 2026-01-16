using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;
using MyApp.Domain.Constants;

namespace MyApp.Application.Users.Commands.CreateUser;

public record CreateUserCommand : IRequest<CreateUserResponse>
{
    public string UserName { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string? Role { get; init; }
}

public record CreateUserResponse
{
    public string UserId { get; init; } = string.Empty;
    public bool Success { get; init; }
    public string[] Errors { get; init; } = Array.Empty<string>();
}

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, CreateUserResponse>
{
    private readonly IIdentityService _identityService;

    public CreateUserCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<CreateUserResponse> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Only assign role if specified (empty or null means no role - public user)
        var role = string.IsNullOrEmpty(request.Role) ? null : request.Role;

        var (result, userId) = await _identityService.CreateUserWithRoleAsync(request.UserName, request.Password, role);

        return new CreateUserResponse
        {
            UserId = userId,
            Success = result.Succeeded,
            Errors = result.Errors
        };
    }
}