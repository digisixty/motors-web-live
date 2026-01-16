using FluentValidation;

namespace MyApp.Application.Users.Commands.UpdateUser;

public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(v => v.Email)
            .EmailAddress()
            .When(v => v.Email != null)
            .WithMessage("Email must be a valid email address.")
            .MaximumLength(256)
            .When(v => v.Email != null)
            .WithMessage("Email must not exceed 256 characters.");
    }
}