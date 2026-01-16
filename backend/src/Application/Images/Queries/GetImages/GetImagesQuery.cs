using Microsoft.EntityFrameworkCore;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MediatR;

namespace MyApp.Application.Images.Queries.GetImages;

[Authorize(Roles = Roles.Administrator)]
public record GetImagesQuery : IRequest<PaginatedList<ImageDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public string? SearchTerm { get; init; }
    public string? FolderPath { get; init; }
    public string? ContentType { get; init; }
}

public class GetImagesQueryHandler : IRequestHandler<GetImagesQuery, PaginatedList<ImageDto>>
{
    private readonly IApplicationDbContext _context;

    public GetImagesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<ImageDto>> Handle(GetImagesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.UploadedImages.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLowerInvariant();
            query = query.Where(i =>
                i.OriginalFileName.ToLowerInvariant().Contains(searchTerm) ||
                (i.Description != null && i.Description.ToLowerInvariant().Contains(searchTerm)) ||
                (i.AltText != null && i.AltText.ToLowerInvariant().Contains(searchTerm)));
        }

        if (!string.IsNullOrWhiteSpace(request.FolderPath))
        {
            query = query.Where(i => i.FolderPath == request.FolderPath);
        }

        if (!string.IsNullOrWhiteSpace(request.ContentType))
        {
            var contentType = request.ContentType;
            if (contentType.EndsWith("/"))
            {
                query = query.Where(i => i.ContentType.StartsWith(contentType));
            }
            else
            {
                query = query.Where(i => i.ContentType == contentType);
            }
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(i => i.Created)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(i => new ImageDto
            {
                Id = i.Id,
                OriginalFileName = i.OriginalFileName,
                StoredFileName = i.StoredFileName,
                RelativeUrl = i.RelativeUrl,
                AbsoluteUrl = i.AbsoluteUrl,
                ContentType = i.ContentType,
                FileSizeInBytes = i.FileSizeInBytes,
                FolderPath = i.FolderPath,
                Description = i.Description,
                AltText = i.AltText,
                Created = i.Created,
                CreatedBy = i.CreatedBy
            })
            .ToListAsync(cancellationToken);

        return new PaginatedList<ImageDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}