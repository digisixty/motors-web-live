using FluentValidation;

namespace MyApp.Application.Images.Commands.CreateImage;

public class CreateImageCommandValidator : AbstractValidator<CreateImageCommand>
{
    public CreateImageCommandValidator()
    {
        RuleFor(v => v.FileStream)
            .NotNull()
            .WithMessage("File stream is required.");

        RuleFor(v => v.FileName)
            .NotEmpty()
            .WithMessage("File name is required.")
            .MaximumLength(500)
            .WithMessage("File name cannot exceed 500 characters.");

        RuleFor(v => v.ContentType)
            .NotEmpty()
            .WithMessage("Content type is required.")
            .Must(IsImageOrVideoFile)
            .WithMessage("Only image and video files (JPEG, PNG, GIF, WebP, SVG, BMP, TIFF, MP4, MPEG, MOV, AVI, MKV, WebM) are allowed.");

        RuleFor(v => v.FileSize)
            .GreaterThan(0)
            .WithMessage("File size must be greater than 0.")
            .LessThanOrEqualTo(100 * 1024 * 1024) // 100MB
            .WithMessage("File size cannot exceed 100MB.");

        RuleFor(v => v.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters.");

        RuleFor(v => v.AltText)
            .MaximumLength(100)
            .WithMessage("Alt text cannot exceed 100 characters.");

        RuleFor(v => v.FolderPath)
            .MaximumLength(100)
            .WithMessage("Folder path cannot exceed 100 characters.")
            .When(v => !string.IsNullOrEmpty(v.FolderPath))
            .Matches(@"^[a-zA-Z0-9\/\-_]*$")
            .WithMessage("Folder path can only contain letters, numbers, forward slashes, hyphens, and underscores.")
            .When(v => !string.IsNullOrEmpty(v.FolderPath));
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