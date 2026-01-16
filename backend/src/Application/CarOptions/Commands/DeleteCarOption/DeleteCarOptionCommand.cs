using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;

namespace MyApp.Application.CarOptions.Commands.DeleteCarOption;

[Authorize(Roles = Roles.Administrator)]
public record DeleteCarOptionCommand : IRequest
{
    public int Id { get; init; }
}

public class DeleteCarOptionCommandHandler : IRequestHandler<DeleteCarOptionCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCarOptionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCarOptionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.CarOptions
            .FindAsync([request.Id], cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(CarOption), request.Id.ToString());
        }

        _context.CarOptions.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}