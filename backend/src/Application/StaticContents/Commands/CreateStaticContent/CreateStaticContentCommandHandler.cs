using MediatR;
using Microsoft.Extensions.Logging;
using MyApp.Application.Common.Interfaces;
using MyApp.Domain.Entities;

namespace MyApp.Application.StaticContents.Commands.CreateStaticContent;

public class CreateStaticContentCommandHandler : IRequestHandler<CreateStaticContentCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<CreateStaticContentCommandHandler> _logger;

    public CreateStaticContentCommandHandler(IApplicationDbContext context, ILogger<CreateStaticContentCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> Handle(CreateStaticContentCommand request, CancellationToken cancellationToken)
    {
        var staticContent = new StaticContent
        {
            Title = request.Title,
            MainImage = request.MainImage,
            Description = request.Description,
            Slug = request.Slug
        };

        _context.StaticContents.Add(staticContent);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created static content with ID: {StaticContentId}", staticContent.Id);

        return staticContent.Id;
    }
}
