using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;

namespace MyApp.Application.CarAttributes.Commands.DeleteCarAttribute;

[Authorize(Roles = Roles.Administrator)]
public record DeleteCarAttributeCommand : IRequest
{
    public int Id { get; init; }
}

public class DeleteCarAttributeCommandHandler : IRequestHandler<DeleteCarAttributeCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCarAttributeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCarAttributeCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.CarAttributes
            .FindAsync([request.Id], cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(CarAttribute), request.Id.ToString());
        }

        _context.CarAttributes.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
