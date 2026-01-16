using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.CarModels.Commands.UpdateCarModel;

[Authorize(Roles = Roles.Administrator)]
public record UpdateCarModelCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Image { get; init; }
    public int ManufacturerId { get; init; }
}

public class UpdateCarModelCommandHandler : IRequestHandler<UpdateCarModelCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateCarModelCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateCarModelCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.CarModels
            .FirstOrDefaultAsync(cm => cm.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(CarModel), request.Id.ToString());

        // Verify manufacturer exists
        var manufacturerExists = await _context.Manufacturers
            .AnyAsync(m => m.Id == request.ManufacturerId, cancellationToken);

        if (!manufacturerExists)
        {
            throw new NotFoundException(nameof(Manufacturer), request.ManufacturerId.ToString());
        }

        entity.Name = request.Name;
        entity.Slug = request.Slug;
        entity.Image = request.Image;
        entity.ManufacturerId = request.ManufacturerId;

        await _context.SaveChangesAsync(cancellationToken);
    }
}