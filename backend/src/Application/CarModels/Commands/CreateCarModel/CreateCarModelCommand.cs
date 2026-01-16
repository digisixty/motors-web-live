using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.CarModels.Commands.CreateCarModel;

[Authorize(Roles = Roles.Administrator)]
public record CreateCarModelCommand : IRequest<int>
{
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Image { get; init; }
    public int ManufacturerId { get; init; }
}

public class CreateCarModelCommandHandler : IRequestHandler<CreateCarModelCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateCarModelCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateCarModelCommand request, CancellationToken cancellationToken)
    {
        // Verify manufacturer exists
        var manufacturerExists = await _context.Manufacturers
            .AnyAsync(m => m.Id == request.ManufacturerId, cancellationToken);

        if (!manufacturerExists)
        {
            throw new NotFoundException(nameof(Manufacturer), request.ManufacturerId.ToString());
        }

        var entity = new CarModel
        {
            Name = request.Name,
            Slug = request.Slug,
            Image = request.Image,
            ManufacturerId = request.ManufacturerId
        };

        _context.CarModels.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}