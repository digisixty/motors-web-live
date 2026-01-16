using MediatR;
using Microsoft.EntityFrameworkCore;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.StaticContents.Common;

namespace MyApp.Application.StaticContents.Queries.GetStaticContent;

public class GetStaticContentQueryHandler : IRequestHandler<GetStaticContentQuery, StaticContentDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;

    public GetStaticContentQueryHandler(IApplicationDbContext context, IFileStorageService fileStorageService)
    {
        _context = context;
        _fileStorageService = fileStorageService;
    }

    public async Task<StaticContentDto?> Handle(GetStaticContentQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.StaticContents
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (entity == null) return null;

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
    }
}
