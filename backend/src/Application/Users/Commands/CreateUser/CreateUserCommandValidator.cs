using FluentValidation;
using MyApp.Domain.Constants;

namespace MyApp.Application.Users.Commands.CreateUser;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(v => v.UserName)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(256);

        RuleFor(v => v.Password)
            .NotEmpty()
            .MinimumLength(6)
            .MaximumLength(100);

        RuleFor(v => v.Role)
            .Must(role => string.IsNullOrEmpty(role) || role == Roles.Administrator)
            .WithMessage($"Role must be either '{Roles.Administrator}' or empty for public user.");
    }
}