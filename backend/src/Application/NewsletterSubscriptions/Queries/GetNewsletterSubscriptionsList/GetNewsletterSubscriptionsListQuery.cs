using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;
using MyApp.Application.NewsletterSubscriptions.Common;

namespace MyApp.Application.NewsletterSubscriptions.Queries.GetNewsletterSubscriptionsList;

public record GetNewsletterSubscriptionsListQuery : IRequest<PaginatedList<NewsletterSubscriptionListDto>>
{
    public int? PageNumber { get; init; } = 1;
    public int? PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public string? Email { get; init; }
    public bool? IsActive { get; init; }
}

public class GetNewsletterSubscriptionsListQueryHandler : IRequestHandler<GetNewsletterSubscriptionsListQuery, PaginatedList<NewsletterSubscriptionListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetNewsletterSubscriptionsListQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<NewsletterSubscriptionListDto>> Handle(GetNewsletterSubscriptionsListQuery request, CancellationToken cancellationToken)
    {
        var query = _context.NewsletterSubscriptions.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(s =>
                s.Email.Contains(request.Search));
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            query = query.Where(s => s.Email.Contains(request.Email));
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(s => s.IsActive == request.IsActive.Value);
        }

        // Apply projection
        var projectedQuery = query
            .Select(s => new NewsletterSubscriptionListDto
            {
                Id = s.Id,
                Email = s.Email,
                IsActive = s.IsActive,
                Created = s.Created
            })
            .OrderByDescending(s => s.Created);

        var pageNumber = request.PageNumber ?? 1;
        var pageSize = request.PageSize ?? 10;

        return await PaginatedList<NewsletterSubscriptionListDto>.CreateAsync(
            projectedQuery,
            pageNumber,
            pageSize,
            cancellationToken);
    }
}
