using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Sliders.Common;
using AutoMapper;
using MyApp.Domain.Entities;

namespace MyApp.Application.Sliders.Commands.CreateSlider;

public class CreateSliderCommandHandler : IRequestHandler<CreateSliderCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<CreateSliderCommandHandler> _logger;

    public CreateSliderCommandHandler(IApplicationDbContext context, IMapper mapper, ILogger<CreateSliderCommandHandler> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<int> Handle(CreateSliderCommand request, CancellationToken cancellationToken)
    {
        var slider = new Slider
        {
            Title = request.Title,
            ShortDescription = request.ShortDescription,
            Image = request.Image,
            IsEnabled = request.IsEnabled,
            BgColor = request.BgColor,
            Video = request.Video,
            Placement = request.Placement,
            CarId = request.CarId
        };

        _context.Sliders.Add(slider);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created slider with ID: {SliderId}", slider.Id);

        return slider.Id;
    }
}