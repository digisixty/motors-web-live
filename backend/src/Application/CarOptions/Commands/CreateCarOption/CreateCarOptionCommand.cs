using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MyApp.Domain.Enums;
using MediatR;

namespace MyApp.Application.CarOptions.Commands.CreateCarOption;

[Authorize(Roles = Roles.Administrator)]
public record CreateCarOptionCommand : IRequest<int>
{
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public int? ParentId { get; init; }
    public string? Image { get; init; }
    public string? Icon { get; init; }
    public string? Description { get; init; }
    public CarOptionType Type { get; init; }
}

public class CreateCarOptionCommandHandler : IRequestHandler<CreateCarOptionCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateCarOptionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateCarOptionCommand request, CancellationToken cancellationToken)
    {
        var entity = new CarOption
        {
            Name = request.Name,
            Slug = request.Slug,
            ParentId = request.ParentId,
            Image = request.Image,
            Icon = request.Icon,
            Description = request.Description,
            Type = request.Type
        };

        _context.CarOptions.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}