using MediatR;
using Microsoft.EntityFrameworkCore;
using MyApp.Application.Common.Interfaces;
using AutoMapper;
using MyApp.Application.Sliders.Common;

namespace MyApp.Application.Sliders.Queries.GetSlider;

public class GetSliderQueryHandler : IRequestHandler<GetSliderQuery, SliderDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly IMapper _mapper;

    public GetSliderQueryHandler(IApplicationDbContext context, IFileStorageService fileStorageService, IMapper mapper)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _mapper = mapper;
    }

    public async Task<SliderDto?> Handle(GetSliderQuery request, CancellationToken cancellationToken)
    {
        var slider = await _context.Sliders
            .Include(s => s.Car)
                .ThenInclude(c => c!.Manufacturer)
            .Include(s => s.Car)
                .ThenInclude(c => c!.CarModel)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (slider == null)
        {
            return null;
        }

        var sliderDto = _mapper.Map<SliderDto>(slider);

        // Set absolute URL for image
        if (!string.IsNullOrEmpty(sliderDto.Image))
        {
            sliderDto.ImageAbsoluteUrl = _fileStorageService.GetAbsoluteImageUrl(sliderDto.Image);
        }

        // Set absolute URL for video
        if (!string.IsNullOrEmpty(sliderDto.Video))
        {
            sliderDto.VideoAbsoluteUrl = _fileStorageService.GetAbsoluteImageUrl(sliderDto.Video);
        }

        // Set absolute URL for car image
        if (sliderDto.Car != null && !string.IsNullOrEmpty(sliderDto.Car.PrimaryImage))
        {
            sliderDto.Car.PrimaryImageAbsoluteUrl = _fileStorageService.GetAbsoluteImageUrl(sliderDto.Car.PrimaryImage);
        }

        return sliderDto;
    }
}