using FluentValidation;
using MyApp.Application.Sliders.Commands.UpdateSlider;

namespace MyApp.Application.Sliders.Commands.UpdateSlider;

public class UpdateSliderCommandValidator : AbstractValidator<UpdateSliderCommand>
{
    public UpdateSliderCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty();

        RuleFor(v => v.Title)
            .MaximumLength(200)
            .NotEmpty();

        RuleFor(v => v.ShortDescription)
            .MaximumLength(500);

        RuleFor(v => v.Image)
            .MaximumLength(500);

        RuleFor(v => v.Video)
            .MaximumLength(500);

        RuleFor(v => v.BgColor)
            .MaximumLength(20)
            .Matches(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^transparent$")
            .When(v => !string.IsNullOrEmpty(v.BgColor))
            .WithMessage("BgColor must be a valid hex color or 'transparent'");

        RuleFor(v => v.Placement)
            .IsInEnum()
            .NotEmpty();
    }
}