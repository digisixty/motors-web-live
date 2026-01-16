using FluentValidation;

namespace MyApp.Application.StaticContents.Commands.DeleteStaticContent;

public class DeleteStaticContentCommandValidator : AbstractValidator<DeleteStaticContentCommand>
{
    public DeleteStaticContentCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty()
            .WithMessage("Id is required.");
    }
}
