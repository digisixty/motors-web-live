using FluentValidation;

namespace MyApp.Application.ContactSubmissions.Commands.CreateContactSubmission;

public class CreateContactSubmissionCommandValidator : AbstractValidator<CreateContactSubmissionCommand>
{
    public CreateContactSubmissionCommandValidator()
    {
        RuleFor(v => v.FullName)
            .NotEmpty()
            .MaximumLength(200)
            .WithMessage("Full name is required and cannot exceed 200 characters.");

        RuleFor(v => v.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(255)
            .WithMessage("A valid email is required and cannot exceed 255 characters.");

        RuleFor(v => v.Message)
            .NotEmpty()
            .MaximumLength(2000)
            .WithMessage("Message is required and cannot exceed 2000 characters.");

        RuleFor(v => v.Type)
            .IsInEnum()
            .WithMessage("Type must be a valid ContactSubmissionType.");

        RuleFor(v => v.ExtraDetails)
            .MaximumLength(1000)
            .WithMessage("Extra details cannot exceed 1000 characters.");

        RuleFor(v => v.RecaptchaToken)
            .NotEmpty()
            .MaximumLength(5000)
            .WithMessage("reCAPTCHA token is required and cannot exceed 1000 characters.");
    }
}
