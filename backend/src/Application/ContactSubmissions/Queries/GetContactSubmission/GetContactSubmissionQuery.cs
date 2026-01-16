using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.ContactSubmissions.Common;

namespace MyApp.Application.ContactSubmissions.Queries.GetContactSubmission;

public record GetContactSubmissionQuery : IRequest<ContactSubmissionDto?>
{
    public int Id { get; init; }
}

public class GetContactSubmissionQueryHandler : IRequestHandler<GetContactSubmissionQuery, ContactSubmissionDto?>
{
    private readonly IApplicationDbContext _context;

    public GetContactSubmissionQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ContactSubmissionDto?> Handle(GetContactSubmissionQuery request, CancellationToken cancellationToken)
    {
        var submission = await _context.ContactSubmissions
            .Where(x => x.Id == request.Id)
            .Select(x => new ContactSubmissionDto
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.Email,
                Message = x.Message,
                Type = x.Type,
                ExtraDetails = x.ExtraDetails,
                IsProcessed = x.IsProcessed,
                ProcessedAt = x.ProcessedAt,
                ProcessedBy = x.ProcessedBy,
                Created = x.Created,
                LastModified = x.LastModified
            })
            .FirstOrDefaultAsync(cancellationToken);

        return submission;
    }
}