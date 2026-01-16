using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;
using MyApp.Application.Common.Security;
using MyApp.Application.CarModels.Common;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Application.CarModels.Queries.GetCarModels;

[Authorize(Roles = Roles.Administrator)]
public record GetCarModelsQuery : IRequest<PaginatedList<CarModelDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public int? ManufacturerId { get; init; }
}

public class GetCarModelsQueryHandler : IRequestHandler<GetCarModelsQuery, PaginatedList<CarModelDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCarModelsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<CarModelDto>> Handle(GetCarModelsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.CarModels
            .Include(cm => cm.Manufacturer)
            .Select(cm => new CarModelDto
            {
                Id = cm.Id,
                Name = cm.Name,
                Slug = cm.Slug,
                Image = cm.Image,
                ImageAbsoluteUrl = cm.Image != null ? Domain.Common.StaticConfiguration.GetAbsoluteUrl(cm.Image) : null,
                ManufacturerId = cm.ManufacturerId,
                ManufacturerName = cm.Manufacturer.Title
            });

        if (request.ManufacturerId.HasValue)
        {
            query = query.Where(cm => cm.ManufacturerId == request.ManufacturerId.Value);
        }

        query = query.OrderBy(cm => cm.ManufacturerName)
            .ThenBy(cm => cm.Name);

        var result = await PaginatedList<CarModelDto>.CreateAsync(query, request.PageNumber, request.PageSize, cancellationToken);
        return result;
    }
}