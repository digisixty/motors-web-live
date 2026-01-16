using FluentValidation;

namespace MyApp.Application.Blogs.Queries.GetBlog;

public class GetBlogQueryValidator : AbstractValidator<GetBlogQuery>
{
    public GetBlogQueryValidator()
    {
        RuleFor(v => v.Id)
            .GreaterThan(0)
            .When(v => v.Id.HasValue)
            .WithMessage("Id must be greater than 0.");

        RuleFor(v => v.Slug)
            .NotEmpty()
            .MaximumLength(200)
            .When(v => !string.IsNullOrEmpty(v.Slug))
            .WithMessage("Slug cannot exceed 200 characters.");

        RuleFor(v => v)
            .Must(v => v.Id.HasValue || !string.IsNullOrWhiteSpace(v.Slug))
            .WithMessage("Either Id or Slug must be provided.");
    }
}