using FluentValidation;

namespace MyApp.Application.Manufacturers.Commands.UpdateManufacturer;

public class UpdateManufacturerCommandValidator : AbstractValidator<UpdateManufacturerCommand>
{
    public UpdateManufacturerCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty();

        RuleFor(v => v.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(v => v.Slug)
            .NotEmpty()
            .MaximumLength(200)
            .Matches(@"^[a-z0-9-]+$").WithMessage("Slug can only contain lowercase letters, numbers, and hyphens.");

        RuleFor(v => v.Description)
            .MaximumLength(1000);

        RuleFor(v => v.Logo)
            .MaximumLength(500);
    }
}