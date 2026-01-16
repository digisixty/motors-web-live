using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.Blogs.Commands.DeleteBlog;

[Authorize(Roles = Roles.Administrator)]
public record DeleteBlogCommand : IRequest
{
    public int Id { get; init; }
}

public class DeleteBlogCommandHandler : IRequestHandler<DeleteBlogCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteBlogCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteBlogCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Blogs
            .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Blog), request.Id.ToString());
        }

        _context.Blogs.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}