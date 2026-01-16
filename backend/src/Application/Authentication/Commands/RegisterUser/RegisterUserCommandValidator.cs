using FluentValidation;

namespace MyApp.Application.Authentication.Commands.RegisterUser;

public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserCommandValidator()
    {
        RuleFor(v => v.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(255)
            .WithMessage("A valid email is required and cannot exceed 255 characters.");

        RuleFor(v => v.Password)
            .NotEmpty()
            .MinimumLength(6)
            .WithMessage("Password is required and must be at least 6 characters.");

        RuleFor(v => v.FirstName)
            .NotEmpty()
            .MaximumLength(100)
            .WithMessage("First name is required and cannot exceed 100 characters.");

        RuleFor(v => v.LastName)
            .NotEmpty()
            .MaximumLength(100)
            .WithMessage("Last name is required and cannot exceed 100 characters.");

        RuleFor(v => v.RecaptchaToken)
            .NotEmpty()
            .MaximumLength(5000)
            .WithMessage("reCAPTCHA token is required and cannot exceed 5000 characters.");
    }
}
