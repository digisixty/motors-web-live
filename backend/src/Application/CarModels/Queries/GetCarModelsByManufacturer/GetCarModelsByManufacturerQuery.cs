using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Application.CarModels.Common;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Application.CarModels.Queries.GetCarModelsByManufacturer;

[Authorize(Roles = Roles.Administrator)]
public record GetCarModelsByManufacturerQuery : IRequest<List<CarModelDto>>
{
    public int ManufacturerId { get; init; }
}

public class GetCarModelsByManufacturerQueryHandler : IRequestHandler<GetCarModelsByManufacturerQuery, List<CarModelDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCarModelsByManufacturerQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CarModelDto>> Handle(GetCarModelsByManufacturerQuery request, CancellationToken cancellationToken)
    {
        // Verify manufacturer exists
        var manufacturerExists = await _context.Manufacturers
            .AnyAsync(m => m.Id == request.ManufacturerId, cancellationToken);

        if (!manufacturerExists)
        {
            throw new NotFoundException(nameof(Manufacturer), request.ManufacturerId.ToString());
        }

        return await _context.CarModels
            .Include(cm => cm.Manufacturer)
            .Where(cm => cm.ManufacturerId == request.ManufacturerId)
            .Select(cm => new CarModelDto
            {
                Id = cm.Id,
                Name = cm.Name,
                Slug = cm.Slug,
                Image = cm.Image,
                ImageAbsoluteUrl = cm.Image != null ? Domain.Common.StaticConfiguration.GetAbsoluteUrl(cm.Image) : null,
                ManufacturerId = cm.ManufacturerId,
                ManufacturerName = cm.Manufacturer.Title
            })
            .OrderBy(cm => cm.Name)
            .ToListAsync(cancellationToken);
    }
}