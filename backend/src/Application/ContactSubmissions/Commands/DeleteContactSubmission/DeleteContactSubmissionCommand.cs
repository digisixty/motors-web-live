using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MediatR;

namespace MyApp.Application.ContactSubmissions.Commands.DeleteContactSubmission;

[Authorize(Roles = Roles.Administrator)]
public record DeleteContactSubmissionCommand : IRequest
{
    public int Id { get; init; }
}

public class DeleteContactSubmissionCommandHandler : IRequestHandler<DeleteContactSubmissionCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteContactSubmissionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteContactSubmissionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.ContactSubmissions
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Contact submission with ID {request.Id} not found");
        }

        _context.ContactSubmissions.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}