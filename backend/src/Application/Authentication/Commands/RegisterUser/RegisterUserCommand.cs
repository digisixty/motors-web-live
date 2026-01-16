using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;

namespace MyApp.Application.Authentication.Commands.RegisterUser;

public record RegisterUserCommand : IRequest<RegisterUserResponse>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string RecaptchaToken { get; init; } = string.Empty;
}

public record RegisterUserResponse
{
    public bool Success { get; init; }
    public string[] Errors { get; init; } = Array.Empty<string>();
}

public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, RegisterUserResponse>
{
    private readonly IIdentityService _identityService;
    private readonly IRecaptchaService _recaptchaService;

    public RegisterUserCommandHandler(
        IIdentityService identityService,
        IRecaptchaService recaptchaService)
    {
        _identityService = identityService;
        _recaptchaService = recaptchaService;
    }

    public async Task<RegisterUserResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        // Validate reCAPTCHA token
        var isValidRecaptcha = await _recaptchaService.ValidateTokenAsync(request.RecaptchaToken, cancellationToken);
        if (!isValidRecaptcha)
        {
            return new RegisterUserResponse
            {
                Success = false,
                Errors = new[] { "Invalid reCAPTCHA token" }
            };
        }

        // Create user with email as username
        var (result, userId) = await _identityService.CreateUserAsync(request.Email, request.Password, request.FirstName, request.LastName);

        return new RegisterUserResponse
        {
            Success = result.Succeeded,
            Errors = result.Errors
        };
    }
}
