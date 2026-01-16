using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;

namespace MyApp.Application.CarListings.Commands.DeleteCarListing;

[Authorize(Roles = Roles.Administrator)]
public record DeleteCarListingCommand : IRequest
{
    public int Id { get; init; }
}

public class DeleteCarListingCommandHandler : IRequestHandler<DeleteCarListingCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCarListingCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCarListingCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.CarListings
            .Include(cl => cl.CarListingAttributes)
            .FirstOrDefaultAsync(cl => cl.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(CarListing), request.Id.ToString());
        }

        _context.CarListings.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}