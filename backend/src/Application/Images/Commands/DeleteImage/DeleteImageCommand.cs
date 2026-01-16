using Microsoft.EntityFrameworkCore;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.Images.Commands.DeleteImage;

[Authorize(Roles = Roles.Administrator)]
public record DeleteImageCommand : IRequest<bool>
{
    public int Id { get; init; }
}

public class DeleteImageCommandHandler : IRequestHandler<DeleteImageCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly IUser _user;

    public DeleteImageCommandHandler(
        IApplicationDbContext context,
        IFileStorageService fileStorageService,
        IUser user)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _user = user;
    }

    public async Task<bool> Handle(DeleteImageCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.UploadedImages
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(UploadedImage), request.Id.ToString());
        }

        try
        {
            // Delete file from MinIO storage
            if (!string.IsNullOrEmpty(entity.RelativeUrl))
            {
                await _fileStorageService.DeleteFileAsync(entity.RelativeUrl, cancellationToken);
            }
        }
        catch (Exception ex)
        {
            // Log the error but continue with database deletion
            // This ensures the database record is removed even if storage deletion fails
            // In production, you might want to implement retry logic or dead letter queue
            Console.WriteLine($"Warning: Failed to delete file from storage: {ex.Message}");
        }

        // Remove from database
        _context.UploadedImages.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}