using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.Sliders.Commands.DeleteSlider;

public class DeleteSliderCommandHandler : IRequestHandler<DeleteSliderCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<DeleteSliderCommandHandler> _logger;

    public DeleteSliderCommandHandler(IApplicationDbContext context, ILogger<DeleteSliderCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Handle(DeleteSliderCommand request, CancellationToken cancellationToken)
    {
        var slider = await _context.Sliders
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Slider with ID {request.Id} not found");

        _context.Sliders.Remove(slider);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted slider with ID: {SliderId}", request.Id);
    }
}