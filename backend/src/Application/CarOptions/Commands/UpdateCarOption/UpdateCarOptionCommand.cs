using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MyApp.Domain.Enums;

namespace MyApp.Application.CarOptions.Commands.UpdateCarOption;

[Authorize(Roles = Roles.Administrator)]
public record UpdateCarOptionCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public int? ParentId { get; init; }
    public string? Image { get; init; }
    public string? Icon { get; init; }
    public string? Description { get; init; }
    public CarOptionType Type { get; init; }
}

public class UpdateCarOptionCommandHandler : IRequestHandler<UpdateCarOptionCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateCarOptionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateCarOptionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.CarOptions
            .FindAsync([request.Id], cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(CarOption), request.Id.ToString());
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