using MediatR;
using Microsoft.EntityFrameworkCore;
using MyApp.Application.Common.Interfaces;
using AutoMapper;
using MyApp.Application.Sliders.Common;
using MyApp.Domain.Enums;

namespace MyApp.Application.Sliders.Queries.GetPublicSliders;

public class GetPublicSlidersQueryHandler : IRequestHandler<GetPublicSlidersQuery, List<PublicSliderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly IMapper _mapper;

    public GetPublicSlidersQueryHandler(IApplicationDbContext context, IFileStorageService fileStorageService, IMapper mapper)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _mapper = mapper;
    }

    public async Task<List<PublicSliderDto>> Handle(GetPublicSlidersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Sliders
            .Include(s => s.Car)
                .ThenInclude(c => c!.Manufacturer)
            .Include(s => s.Car)
                .ThenInclude(c => c!.CarModel)
            .Where(s => s.IsEnabled);

        if (request.Placement.HasValue)
        {
            query = query.Where(s => s.Placement == request.Placement.Value);
        }

        var sliders = await query
            .OrderBy(s => s.Created)
            .ToListAsync(cancellationToken);

        var sliderDtos = _mapper.Map<List<PublicSliderDto>>(sliders);

        // Set absolute URLs for images and videos
        foreach (var slider in sliderDtos)
        {
            if (!string.IsNullOrEmpty(slider.Image))
            {
                slider.ImageAbsoluteUrl = _fileStorageService.GetAbsoluteImageUrl(slider.Image);
            }

            if (!string.IsNullOrEmpty(slider.Video))
            {
                slider.VideoAbsoluteUrl = _fileStorageService.GetAbsoluteImageUrl(slider.Video);
            }

            if (slider.Car != null && !string.IsNullOrEmpty(slider.Car.PrimaryImage))
            {
                slider.Car.PrimaryImageAbsoluteUrl = _fileStorageService.GetAbsoluteImageUrl(slider.Car.PrimaryImage);
            }
        }

        return sliderDtos;
    }
}