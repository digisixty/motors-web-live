using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using MediatR;

namespace MyApp.Application.Images.Commands.CreateImage;

[Authorize(Roles = Roles.Administrator)]
public record CreateImageCommand : IRequest<int>
{
    public Stream FileStream { get; init; } = null!;
    public string FileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long FileSize { get; init; }
    public string? Description { get; init; }
    public string? AltText { get; init; }
    public string? FolderPath { get; init; }
}

public class CreateImageCommandHandler : IRequestHandler<CreateImageCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    private readonly IUser _user;

    public CreateImageCommandHandler(
        IApplicationDbContext context,
        IFileStorageService fileStorageService,
        IUser user)
    {
        _context = context;
        _fileStorageService = fileStorageService;
        _user = user;
    }

    public async Task<int> Handle(CreateImageCommand request, CancellationToken cancellationToken)
    {
        if (request.FileStream == null || request.FileSize == 0)
        {
            throw new ArgumentException("File stream is required and cannot be empty.");
        }

        // Validate file type (image and video validation)
        if (!IsImageOrVideoFile(request.ContentType))
        {
            throw new ArgumentException("Only image and video files are allowed.");
        }

        // Validate file size (e.g., 100MB max)
        const long maxFileSize = 100 * 1024 * 1024; // 100MB
        if (request.FileSize > maxFileSize)
        {
            throw new ArgumentException($"File size cannot exceed {maxFileSize / (1024 * 1024)}MB.");
        }

        // Upload to MinIO
        var relativeUrl = await _fileStorageService.UploadFileAsync(
            request.FileStream,
            request.FileName,
            request.ContentType,
            request.FolderPath,
            makePublic: true,
            cancellationToken);

        // Create database record
        var entity = new UploadedImage
        {
            OriginalFileName = request.FileName,
            StoredFileName = System.IO.Path.GetFileName(relativeUrl),
            RelativeUrl = relativeUrl,
            ContentType = request.ContentType,
            FileSizeInBytes = request.FileSize,
            FolderPath = request.FolderPath,
            Description = request.Description,
            AltText = request.AltText,
            CreatedBy = _user.Id,
            Created = DateTimeOffset.UtcNow,
            LastModified = DateTimeOffset.UtcNow,
            LastModifiedBy = _user.Id
        };

        _context.UploadedImages.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }

    private static bool IsImageOrVideoFile(string contentType)
    {
        return contentType.ToLowerInvariant() switch
        {
            // Image types
            "image/jpeg" => true,
            "image/jpg" => true,
            "image/png" => true,
            "image/gif" => true,
            "image/webp" => true,
            "image/svg+xml" => true,
            "image/bmp" => true,
            "image/tiff" => true,
            // Video types
            "video/mp4" => true,
            "video/mpeg" => true,
            "video/quicktime" => true,
            "video/x-msvideo" => true,
            "video/x-matroska" => true,
            "video/webm" => true,
            _ => false
        };
    }
}