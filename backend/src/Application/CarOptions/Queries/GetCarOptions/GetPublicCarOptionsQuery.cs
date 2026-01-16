using MyApp.Application.Common.Interfaces;
using MyApp.Application.CarOptions.Queries.GetCarOptions;

namespace MyApp.Application.CarOptions.Queries.GetCarOptions;

public record GetPublicCarOptionsQuery(int? ParentId = null) : IRequest<List<CarOptionDto>>;

public class GetPublicCarOptionsQueryHandler : IRequestHandler<GetPublicCarOptionsQuery, List<CarOptionDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPublicCarOptionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CarOptionDto>> Handle(GetPublicCarOptionsQuery request, CancellationToken cancellationToken)
    {
        // Load all options ordered by name for consistent results
        var allCarOptions = await _context.CarOptions
            .OrderBy(co => co.Name)
            .ToListAsync(cancellationToken);

        // Find the parent option(s) based on the filter
        IEnumerable<Domain.Entities.CarOption> parentOptions;

        if (request.ParentId.HasValue)
        {
            // Get specific parent and its children
            parentOptions = allCarOptions
                .Where(co => co.Id == request.ParentId.Value)
                .Take(1); // Only one parent by ID
        }
        else
        {
            // Get all root options (no parentId specified)
            parentOptions = allCarOptions
                .Where(co => co.ParentId == null);
        }

        // Build the hierarchy recursively for the selected parent(s)
        var resultOptions = parentOptions
            .Select(opt => BuildOptionHierarchy(opt, allCarOptions))
            .ToList();

        return resultOptions;
    }

    private static CarOptionDto BuildOptionHierarchy(Domain.Entities.CarOption option, List<Domain.Entities.CarOption> allOptions)
    {
        var children = allOptions
            .Where(co => co.ParentId == option.Id)
            .Select(child => BuildOptionHierarchy(child, allOptions))
            .ToList();

        return new CarOptionDto
        {
            Id = option.Id,
            Name = option.Name,
            Slug = option.Slug,
            ParentId = option.ParentId,
            Image = option.Image,
            Icon = option.Icon,
            Description = option.Description,
            Type = option.Type,
            Children = children
        };
    }
}