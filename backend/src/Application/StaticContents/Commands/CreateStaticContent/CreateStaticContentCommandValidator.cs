using FluentValidation;

namespace MyApp.Application.StaticContents.Commands.CreateStaticContent;

public class CreateStaticContentCommandValidator : AbstractValidator<CreateStaticContentCommand>
{
    public CreateStaticContentCommandValidator()
    {
        RuleFor(v => v.Title)
            .MaximumLength(200).NotEmpty()
            .WithMessage("Title is required and must not exceed 200 characters.");

        RuleFor(v => v.MainImage)
            .MaximumLength(500)
            .WithMessage("Main image path must not exceed 500 characters.");

        RuleFor(v => v.Description)
            .NotEmpty()
            .WithMessage("Description is required.");

        RuleFor(v => v.Slug)
            .MaximumLength(200).NotEmpty()
            .WithMessage("Slug is required and must not exceed 200 characters.")
            .Matches("^[a-z0-9-]+$")
            .WithMessage("Slug can only contain lowercase letters, numbers, and hyphens.");
    }
}
