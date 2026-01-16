using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;

namespace MyApp.Application.Authentication.Commands.Login;

public record LoginCommand : IRequest<LoginResponse>
{
    public string UserName { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public record LoginResponse
{
    public string Token { get; init; } = string.Empty;
    public bool Success { get; init; }
    public string[] Errors { get; init; } = Array.Empty<string>();
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IIdentityService _identityService;

    public LoginCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var (result, token) = await _identityService.UserLoginAsync(request.UserName, request.Password);

        return new LoginResponse
        {
            Token = token,
            Success = result.Succeeded,
            Errors = result.Errors
        };
    }
}
