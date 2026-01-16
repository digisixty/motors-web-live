using FluentValidation;

namespace MyApp.Application.Blogs.Queries.GetBlogsList;

public class GetBlogsListQueryValidator : AbstractValidator<GetBlogsListQuery>
{
    public GetBlogsListQueryValidator()
    {
        RuleFor(v => v.PageNumber)
            .GreaterThan(0)
            .When(v => v.PageNumber.HasValue)
            .WithMessage("PageNumber must be greater than 0.");

        RuleFor(v => v.PageSize)
            .GreaterThan(0)
            .When(v => v.PageSize.HasValue)
            .WithMessage("PageSize must be greater than 0.");

        RuleFor(v => v.Search)
            .MaximumLength(200)
            .When(v => !string.IsNullOrEmpty(v.Search))
            .WithMessage("Search term cannot exceed 200 characters.");

        RuleFor(v => v.Title)
            .MaximumLength(200)
            .When(v => !string.IsNullOrEmpty(v.Title))
            .WithMessage("Title filter cannot exceed 200 characters.");

        RuleFor(v => v.Slug)
            .MaximumLength(200)
            .When(v => !string.IsNullOrEmpty(v.Slug))
            .WithMessage("Slug filter cannot exceed 200 characters.");
    }
}