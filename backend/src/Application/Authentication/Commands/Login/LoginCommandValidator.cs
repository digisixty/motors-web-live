using FluentValidation;

namespace MyApp.Application.Authentication.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(v => v.UserName)
            .NotEmpty()
            .MaximumLength(255)
            .WithMessage("Username is required and cannot exceed 255 characters.");

        RuleFor(v => v.Password)
            .NotEmpty()
            .WithMessage("Password is required.");
    }
}
