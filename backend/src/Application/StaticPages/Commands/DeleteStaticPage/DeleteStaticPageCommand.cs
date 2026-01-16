using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.StaticPages.Commands.DeleteStaticPage;

[Authorize(Roles = Roles.Administrator)]
public record DeleteStaticPageCommand : IRequest
{
    public int Id { get; init; }
}

public class DeleteStaticPageCommandHandler : IRequestHandler<DeleteStaticPageCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteStaticPageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteStaticPageCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.StaticPages
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(StaticPage), request.Id.ToString());
        }

        _context.StaticPages.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}