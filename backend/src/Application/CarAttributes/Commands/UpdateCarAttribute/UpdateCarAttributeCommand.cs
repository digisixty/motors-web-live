using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MyApp.Domain.Enums;

namespace MyApp.Application.CarAttributes.Commands.UpdateCarAttribute;

[Authorize(Roles = Roles.Administrator)]
public record UpdateCarAttributeCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public int? ParentId { get; init; }
    public string? Image { get; init; }
    public string? Icon { get; init; }
    public string? Description { get; init; }
    public CarAttributeType Type { get; init; }
}

public class UpdateCarAttributeCommandHandler : IRequestHandler<UpdateCarAttributeCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateCarAttributeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateCarAttributeCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.CarAttributes
            .FindAsync([request.Id], cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(CarAttribute), request.Id.ToString());
        }

        entity.Name = request.Name;
        entity.Slug = request.Slug;
        entity.ParentId = request.ParentId;
        entity.Image = request.Image;
        entity.Icon = request.Icon;
        entity.Description = request.Description;
        entity.Type = request.Type;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
