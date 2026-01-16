using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MediatR;

namespace MyApp.Application.NewsletterSubscriptions.Commands.DeleteNewsletterSubscription;

[Authorize(Roles = Roles.Administrator)]
public record DeleteNewsletterSubscriptionCommand : IRequest
{
    public int Id { get; init; }
}

public class DeleteNewsletterSubscriptionCommandHandler : IRequestHandler<DeleteNewsletterSubscriptionCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteNewsletterSubscriptionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteNewsletterSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.NewsletterSubscriptions
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Newsletter subscription with ID {request.Id} not found");
        }

        _context.NewsletterSubscriptions.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
