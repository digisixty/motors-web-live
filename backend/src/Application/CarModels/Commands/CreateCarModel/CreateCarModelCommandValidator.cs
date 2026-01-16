using FluentValidation;

namespace MyApp.Application.CarModels.Commands.CreateCarModel;

public class CreateCarModelCommandValidator : AbstractValidator<CreateCarModelCommand>
{
    public CreateCarModelCommandValidator()
    {
        RuleFor(v => v.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(v => v.Slug)
            .NotEmpty()
            .MaximumLength(200)
            .Matches(@"^[a-z0-9-]+$").WithMessage("Slug can only contain lowercase letters, numbers, and hyphens.");

        RuleFor(v => v.Image)
            .MaximumLength(500);

        RuleFor(v => v.ManufacturerId)
            .NotEmpty();
    }
}