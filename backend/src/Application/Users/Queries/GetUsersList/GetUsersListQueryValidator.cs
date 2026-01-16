using FluentValidation;

namespace MyApp.Application.Users.Queries.GetUsersList;

public class GetUsersListQueryValidator : AbstractValidator<GetUsersListQuery>
{
    public GetUsersListQueryValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThan(0)
            .When(x => x.PageNumber.HasValue);

        RuleFor(x => x.PageSize)
            .GreaterThan(0)
            .LessThanOrEqualTo(100)
            .When(x => x.PageSize.HasValue);

        RuleFor(x => x.Search)
            .MaximumLength(100)
            .When(x => x.Search != null);

        RuleFor(x => x.Role)
            .MaximumLength(50)
            .When(x => x.Role != null);
    }
}