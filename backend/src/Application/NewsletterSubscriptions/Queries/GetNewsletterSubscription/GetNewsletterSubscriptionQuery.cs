using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.NewsletterSubscriptions.Common;

namespace MyApp.Application.NewsletterSubscriptions.Queries.GetNewsletterSubscription;

public record GetNewsletterSubscriptionQuery : IRequest<NewsletterSubscriptionDto?>
{
    public int Id { get; init; }
}

public class GetNewsletterSubscriptionQueryHandler : IRequestHandler<GetNewsletterSubscriptionQuery, NewsletterSubscriptionDto?>
{
    private readonly IApplicationDbContext _context;

    public GetNewsletterSubscriptionQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<NewsletterSubscriptionDto?> Handle(GetNewsletterSubscriptionQuery request, CancellationToken cancellationToken)
    {
        var subscription = await _context.NewsletterSubscriptions
            .Where(x => x.Id == request.Id)
            .Select(x => new NewsletterSubscriptionDto
            {
                Id = x.Id,
                Email = x.Email,
                IsActive = x.IsActive,
                Created = x.Created,
                LastModified = x.LastModified
            })
            .FirstOrDefaultAsync(cancellationToken);

        return subscription;
    }
}
