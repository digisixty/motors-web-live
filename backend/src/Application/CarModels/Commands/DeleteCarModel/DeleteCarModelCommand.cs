using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.CarModels.Commands.DeleteCarModel;

[Authorize(Roles = Roles.Administrator)]
public record DeleteCarModelCommand : IRequest
{
    public int Id { get; init; }
}

public class DeleteCarModelCommandHandler : IRequestHandler<DeleteCarModelCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCarModelCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCarModelCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.CarModels
            .FirstOrDefaultAsync(cm => cm.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(CarModel), request.Id.ToString());

        _context.CarModels.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}