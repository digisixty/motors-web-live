using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.Sliders.Commands.UpdateSlider;

public class UpdateSliderCommandHandler : IRequestHandler<UpdateSliderCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<UpdateSliderCommandHandler> _logger;

    public UpdateSliderCommandHandler(IApplicationDbContext context, ILogger<UpdateSliderCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Handle(UpdateSliderCommand request, CancellationToken cancellationToken)
    {
        var slider = await _context.Sliders
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Slider with ID {request.Id} not found");

        slider.Title = request.Title;
        slider.ShortDescription = request.ShortDescription;
        slider.Image = request.Image;
        slider.IsEnabled = request.IsEnabled;
        slider.BgColor = request.BgColor;
        slider.Video = request.Video;
        slider.Placement = request.Placement;
        slider.CarId = request.CarId;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated slider with ID: {SliderId}", slider.Id);
    }
}