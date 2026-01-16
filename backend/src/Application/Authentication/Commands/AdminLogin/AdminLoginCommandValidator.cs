using FluentValidation;

namespace MyApp.Application.Authentication.Commands.AdminLogin;

public class AdminLoginCommandValidator : AbstractValidator<AdminLoginCommand>
{
    public AdminLoginCommandValidator()
    {
        RuleFor(v => v.UserName)
            .NotEmpty()
            .WithMessage("Username is required.")
            .MaximumLength(256)
            .WithMessage("Username must not exceed 256 characters.");

        RuleFor(v => v.Password)
            .NotEmpty()
            .WithMessage("Password is required.")
            .MinimumLength(6)
            .WithMessage("Password must be at least 6 characters long.");
    }
}