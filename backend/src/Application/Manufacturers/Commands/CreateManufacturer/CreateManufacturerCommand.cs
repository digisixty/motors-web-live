using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.Manufacturers.Commands.CreateManufacturer;

[Authorize(Roles = Roles.Administrator)]
public record CreateManufacturerCommand : IRequest<int>
{
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Logo { get; init; }
}

public class CreateManufacturerCommandHandler : IRequestHandler<CreateManufacturerCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateManufacturerCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateManufacturerCommand request, CancellationToken cancellationToken)
    {
        var entity = new Manufacturer
        {
            Title = request.Title,
            Slug = request.Slug,
            Description = request.Description,
            Logo = request.Logo
        };

        _context.Manufacturers.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}