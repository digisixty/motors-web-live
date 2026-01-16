using FluentValidation;

namespace MyApp.Application.StaticPages.Commands.DeleteStaticPage;

public class DeleteStaticPageCommandValidator : AbstractValidator<DeleteStaticPageCommand>
{
    public DeleteStaticPageCommandValidator()
    {
        RuleFor(v => v.Id)
            .GreaterThan(0)
            .WithMessage("Id must be greater than 0.");
    }
}