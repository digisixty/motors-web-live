using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.Manufacturers.Commands.DeleteManufacturer;

[Authorize(Roles = Roles.Administrator)]
public record DeleteManufacturerCommand : IRequest
{
    public int Id { get; init; }
}

public class DeleteManufacturerCommandHandler : IRequestHandler<DeleteManufacturerCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteManufacturerCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteManufacturerCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Manufacturers
            .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Manufacturer), request.Id.ToString());

        _context.Manufacturers.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}