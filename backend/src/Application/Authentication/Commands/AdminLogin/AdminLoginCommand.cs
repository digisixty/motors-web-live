using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;

namespace MyApp.Application.Authentication.Commands.AdminLogin;

public record AdminLoginCommand : IRequest<AdminLoginResponse>
{
    public string UserName { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public record AdminLoginResponse
{
    public string Token { get; init; } = string.Empty;
    public bool Success { get; init; }
    public string[] Errors { get; init; } = Array.Empty<string>();
}

public class AdminLoginCommandHandler : IRequestHandler<AdminLoginCommand, AdminLoginResponse>
{
    private readonly IIdentityService _identityService;

    public AdminLoginCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<AdminLoginResponse> Handle(AdminLoginCommand request, CancellationToken cancellationToken)
    {
        var (result, token) = await _identityService.LoginAsync(request.UserName, request.Password);

        return new AdminLoginResponse
        {
            Token = token,
            Success = result.Succeeded,
            Errors = result.Errors
        };
    }
}