using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Application.Manufacturers.Common;
using MyApp.Domain.Constants;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Application.Manufacturers.Queries.GetManufacturers;

[Authorize(Roles = Roles.Administrator)]
public record GetManufacturersQuery : IRequest<List<ManufacturerDto>>;

public class GetManufacturersQueryHandler : IRequestHandler<GetManufacturersQuery, List<ManufacturerDto>>
{
    private readonly IApplicationDbContext _context;

    public GetManufacturersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ManufacturerDto>> Handle(GetManufacturersQuery request, CancellationToken cancellationToken)
    {
        return await _context.Manufacturers
            .Select(m => new ManufacturerDto
            {
                Id = m.Id,
                Title = m.Title,
                Slug = m.Slug,
                Description = m.Description,
                Logo = m.Logo,
                LogoAbsoluteUrl = m.Logo != null ? Domain.Common.StaticConfiguration.GetAbsoluteUrl(m.Logo) : null
            })
            .OrderBy(m => m.Title)
            .ToListAsync(cancellationToken);
    }
}