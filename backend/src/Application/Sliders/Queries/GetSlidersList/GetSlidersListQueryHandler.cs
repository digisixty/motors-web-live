using MediatR;
using Microsoft.EntityFrameworkCore;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Mappings;
using MyApp.Application.Common.Models;
using MyApp.Application.Sliders.Common;
using MyApp.Domain.Enums;

namespace MyApp.Application.Sliders.Queries.GetSlidersList;

public class GetSlidersListQueryHandler : IRequestHandler<GetSlidersListQuery, PaginatedList<SliderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly IMapper _mapper;

    public GetSlidersListQueryHandler(IApplicationDbContext context, IFileStorageService fileStorageService, IMapper mapper)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _mapper = mapper;
    }

    public async Task<PaginatedList<SliderDto>> Handle(GetSlidersListQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Sliders
            .Include(s => s.Car)
                .ThenInclude(c => c!.Manufacturer)
            .Include(s => s.Car)
                .ThenInclude(c => c!.CarModel)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.Title))
        {
            query = query.Where(s => s.Title.Contains(request.Title));
        }

        if (request.IsEnabled.HasValue)
        {
            query = query.Where(s => s.IsEnabled == request.IsEnabled.Value);
        }

        if (request.Placement.HasValue)
        {
            query = query.Where(s => s.Placement == request.Placement.Value);
        }

        var sliders = await query
            .OrderByDescending(s => s.Created)
            .ProjectToListAsync<SliderDto>(_mapper.ConfigurationProvider, cancellationToken);

        // Set absolute URLs for images and videos
        foreach (var slider in sliders)
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

        return new PaginatedList<SliderDto>(sliders, sliders.Count, request.PageNumber, request.PageSize);
    }
}