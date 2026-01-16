using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;

namespace MyApp.Application.CarAttributes.Queries.GetCarAttributes;

[Authorize(Roles = Roles.Administrator)]
public record GetCarAttributesQuery(int? ParentId = null) : IRequest<List<CarAttributeDto>>;

public class GetCarAttributesQueryHandler : IRequestHandler<GetCarAttributesQuery, List<CarAttributeDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCarAttributesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CarAttributeDto>> Handle(GetCarAttributesQuery request, CancellationToken cancellationToken)
    {
        // Load all attributes flat
        var allCarAttributes = await _context.CarAttributes
            .OrderBy(ca => ca.Name)
            .ToListAsync(cancellationToken);

        // Find the parent attribute(s) based on the filter
        IEnumerable<Domain.Entities.CarAttribute> parentAttributes;

        if (request.ParentId.HasValue)
        {
            // Get specific parent and its children
            parentAttributes = allCarAttributes
                .Where(ca => ca.Id == request.ParentId.Value)
                .Take(1); // Only one parent by ID
        }
        else
        {
            // Get all root attributes (no parentId specified)
            parentAttributes = allCarAttributes
                .Where(ca => ca.ParentId == null);
        }

        // Build the hierarchy recursively for the selected parent(s)
        var resultAttributes = parentAttributes
            .Select(attr => BuildAttributeHierarchy(attr, allCarAttributes))
            .ToList();

        return resultAttributes;
    }

    private static CarAttributeDto BuildAttributeHierarchy(Domain.Entities.CarAttribute attribute, List<Domain.Entities.CarAttribute> allAttributes)
    {
        var children = allAttributes
            .Where(ca => ca.ParentId == attribute.Id)
            .Select(child => BuildAttributeHierarchy(child, allAttributes))
            .ToList();

        return new CarAttributeDto
        {
            Id = attribute.Id,
            Name = attribute.Name,
            Slug = attribute.Slug,
            ParentId = attribute.ParentId,
            Image = attribute.Image,
            Icon = attribute.Icon,
            Description = attribute.Description,
            Type = attribute.Type,
            Children = children
        };
    }
}