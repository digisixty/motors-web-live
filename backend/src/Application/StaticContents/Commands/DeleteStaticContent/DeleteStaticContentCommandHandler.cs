using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MyApp.Application.Common.Interfaces;
using MyApp.Domain.Entities;

namespace MyApp.Application.StaticContents.Commands.DeleteStaticContent;

public class DeleteStaticContentCommandHandler : IRequestHandler<DeleteStaticContentCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<DeleteStaticContentCommandHandler> _logger;

    public DeleteStaticContentCommandHandler(IApplicationDbContext context, ILogger<DeleteStaticContentCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Handle(DeleteStaticContentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.StaticContents
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Static content with ID {request.Id} not found.");

        _context.StaticContents.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted static content with ID: {StaticContentId}", entity.Id);
    }
}
