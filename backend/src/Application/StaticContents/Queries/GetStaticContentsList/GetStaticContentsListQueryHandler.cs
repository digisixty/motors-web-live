using MediatR;
using Microsoft.EntityFrameworkCore;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;
using MyApp.Application.StaticContents.Common;

namespace MyApp.Application.StaticContents.Queries.GetStaticContentsList;

public class GetStaticContentsListQueryHandler : IRequestHandler<GetStaticContentsListQuery, PaginatedList<StaticContentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;

    public GetStaticContentsListQueryHandler(IApplicationDbContext context, IFileStorageService fileStorageService)
    {
        _context = context;
        _fileStorageService = fileStorageService;
    }

    public async Task<PaginatedList<StaticContentDto>> Handle(GetStaticContentsListQuery request, CancellationToken cancellationToken)
    {
        var query = _context.StaticContents.AsQueryable();

        if (!string.IsNullOrEmpty(request.Title))
        {
            query = query.Where(s => s.Title.Contains(request.Title));
        }

        if (!string.IsNullOrEmpty(request.Slug))
        {
            query = query.Where(s => s.Slug.Contains(request.Slug));
        }

        var count = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(s => s.Created)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var itemDtos = items.Select(entity =>
        {
            var dto = new StaticContentDto
            {
                Id = entity.Id,
                Title = entity.Title,
                MainImage = entity.MainImage,
                Description = entity.Description,
                Slug = entity.Slug,
                Created = entity.Created,
                CreatedBy = entity.CreatedBy,
                LastModified = entity.LastModified,
                LastModifiedBy = entity.LastModifiedBy
            };

            if (!string.IsNullOrEmpty(entity.MainImage))
            {
                dto.MainImageAbsoluteUrl = _fileStorageService.GetAbsoluteImageUrl(entity.MainImage);
            }

            return dto;
        }).ToList();

        var paginatedList = new PaginatedList<StaticContentDto>(itemDtos, count, request.PageNumber, request.PageSize);

        return paginatedList;
    }
}
