using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.Manufacturers.Commands.UpdateManufacturer;

[Authorize(Roles = Roles.Administrator)]
public record UpdateManufacturerCommand : IRequest
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Logo { get; init; }
}

public class UpdateManufacturerCommandHandler : IRequestHandler<UpdateManufacturerCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateManufacturerCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateManufacturerCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Manufacturers
            .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Manufacturer), request.Id.ToString());

        entity.Title = request.Title;
        entity.Slug = request.Slug;
        entity.Description = request.Description;
        entity.Logo = request.Logo;

        await _context.SaveChangesAsync(cancellationToken);
    }
}