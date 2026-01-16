using FluentValidation;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.Blogs.Commands.DeleteBlog;

public class DeleteBlogCommandValidator : AbstractValidator<DeleteBlogCommand>
{
    public DeleteBlogCommandValidator()
    {
        RuleFor(v => v.Id)
            .GreaterThan(0)
            .WithMessage("Id must be greater than 0.");
    }
}