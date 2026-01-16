using MediatR;
using Microsoft.EntityFrameworkCore;
using MyApp.Application.CarModels.Common;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;

namespace MyApp.Application.CarModels.Queries.GetCarModelById;

[Authorize(Roles = Roles.Administrator)]
public record GetCarModelByIdQuery : IRequest<CarModelDto>
{
    public int Id { get; init; }
}

public class GetCarModelByIdQueryHandler : IRequestHandler<GetCarModelByIdQuery, CarModelDto>
{
    private readonly IApplicationDbContext _context;

    public GetCarModelByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CarModelDto> Handle(GetCarModelByIdQuery request, CancellationToken cancellationToken)
    {
        var carModel = await _context.CarModels
            .Include(cm => cm.Manufacturer)
            .Where(cm => cm.Id == request.Id)
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
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException(nameof(CarModel), request.Id.ToString());

        return carModel;
    }
}
