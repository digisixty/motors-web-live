using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;
using MyApp.Application.ContactSubmissions.Common;
using MyApp.Domain.Enums;

namespace MyApp.Application.ContactSubmissions.Queries.GetContactSubmissionsList;

public record GetContactSubmissionsListQuery : IRequest<PaginatedList<ContactSubmissionListDto>>
{
    public int? PageNumber { get; init; } = 1;
    public int? PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public string? FullName { get; init; }
    public string? Email { get; init; }
    public bool? IsProcessed { get; init; }
    public ContactSubmissionType? Type { get; init; }
}

public class GetContactSubmissionsListQueryHandler : IRequestHandler<GetContactSubmissionsListQuery, PaginatedList<ContactSubmissionListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetContactSubmissionsListQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<ContactSubmissionListDto>> Handle(GetContactSubmissionsListQuery request, CancellationToken cancellationToken)
    {
        var query = _context.ContactSubmissions.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(s =>
                s.FullName.Contains(request.Search) ||
                s.Email.Contains(request.Search) ||
                s.Message.Contains(request.Search) ||
                s.Type.ToString().Contains(request.Search) ||
                (s.ExtraDetails != null && s.ExtraDetails.Contains(request.Search)));
        }

        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            query = query.Where(s => s.FullName.Contains(request.FullName));
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            query = query.Where(s => s.Email.Contains(request.Email));
        }

        if (request.IsProcessed.HasValue)
        {
            query = query.Where(s => s.IsProcessed == request.IsProcessed.Value);
        }

        if (request.Type.HasValue)
        {
            query = query.Where(s => s.Type == request.Type.Value);
        }

        // Apply projection
        var projectedQuery = query
            .Select(s => new ContactSubmissionListDto
            {
                Id = s.Id,
                FullName = s.FullName,
                Email = s.Email,
                Message = s.Message,
                Type = s.Type,
                IsProcessed = s.IsProcessed,
                Created = s.Created
            })
            .OrderByDescending(s => s.Created);

        var pageNumber = request.PageNumber ?? 1;
        var pageSize = request.PageSize ?? 10;

        return await PaginatedList<ContactSubmissionListDto>.CreateAsync(
            projectedQuery,
            pageNumber,
            pageSize,
            cancellationToken);
    }
}