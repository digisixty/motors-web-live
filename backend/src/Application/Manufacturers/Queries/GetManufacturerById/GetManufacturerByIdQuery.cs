using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Application.Manufacturers.Common;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Application.Manufacturers.Queries.GetManufacturerById;

[Authorize(Roles = Roles.Administrator)]
public record GetManufacturerByIdQuery : IRequest<ManufacturerDto>
{
    public int Id { get; init; }
}

public class GetManufacturerByIdQueryHandler : IRequestHandler<GetManufacturerByIdQuery, ManufacturerDto>
{
    private readonly IApplicationDbContext _context;

    public GetManufacturerByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ManufacturerDto> Handle(GetManufacturerByIdQuery request, CancellationToken cancellationToken)
    {
        var manufacturer = await _context.Manufacturers
            .Where(m => m.Id == request.Id)
            .Select(m => new ManufacturerDto
            {
                Id = m.Id,
                Title = m.Title,
                Slug = m.Slug,
                Description = m.Description,
                Logo = m.Logo,
                LogoAbsoluteUrl = m.Logo != null ? Domain.Common.StaticConfiguration.GetAbsoluteUrl(m.Logo) : null
            })
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException(nameof(Manufacturer), request.Id.ToString());

        return manufacturer;
    }
}