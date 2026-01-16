using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MyApp.Application.Common.Interfaces;
using MyApp.Domain.Entities;

namespace MyApp.Application.StaticContents.Commands.UpdateStaticContent;

public class UpdateStaticContentCommandHandler : IRequestHandler<UpdateStaticContentCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<UpdateStaticContentCommandHandler> _logger;

    public UpdateStaticContentCommandHandler(IApplicationDbContext context, ILogger<UpdateStaticContentCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Handle(UpdateStaticContentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.StaticContents
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Static content with ID {request.Id} not found.");

        entity.Title = request.Title;
        entity.MainImage = request.MainImage;
        entity.Description = request.Description;
        entity.Slug = request.Slug;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated static content with ID: {StaticContentId}", entity.Id);
    }
}
