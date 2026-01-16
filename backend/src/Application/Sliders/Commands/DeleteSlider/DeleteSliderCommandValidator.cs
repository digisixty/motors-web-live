using FluentValidation;
using MyApp.Application.Sliders.Commands.DeleteSlider;

namespace MyApp.Application.Sliders.Commands.DeleteSlider;

public class DeleteSliderCommandValidator : AbstractValidator<DeleteSliderCommand>
{
    public DeleteSliderCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty();
    }
}