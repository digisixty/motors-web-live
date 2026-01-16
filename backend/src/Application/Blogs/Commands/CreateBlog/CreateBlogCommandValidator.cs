using FluentValidation;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.Blogs.Commands.CreateBlog;

public class CreateBlogCommandValidator : AbstractValidator<CreateBlogCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateBlogCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.Title)
            .NotEmpty()
            .MaximumLength(200)
            .WithMessage("Title is required and cannot exceed 200 characters.");

        RuleFor(v => v.Slug)
            .NotEmpty()
            .MaximumLength(200)
            .MustAsync(BeUniqueSlug)
                .WithMessage("'{PropertyName}' must be unique.")
                .WithErrorCode("Unique");

        RuleFor(v => v.ShortDescription)
            .MaximumLength(500)
            .WithMessage("Short description cannot exceed 500 characters.");

        RuleFor(v => v.FullDescription)
            .MaximumLength(5000)
            .WithMessage("Full description cannot exceed 5000 characters.");

        RuleFor(v => v.CoverImage)
            .MaximumLength(500)
            .WithMessage("Cover image URL cannot exceed 500 characters.");

        RuleFor(v => v.MetaTags)
            .MaximumLength(1000)
            .WithMessage("Meta tags cannot exceed 1000 characters.");

        RuleFor(v => v.ImagesGallery)
            .Must(HaveValidImageUrls)
                .WithMessage("Image gallery must contain valid URLs.")
                .When(v => v.ImagesGallery != null && v.ImagesGallery.Any());

        RuleFor(v => v.VideosGallery)
            .Must(HaveValidVideoUrls)
                .WithMessage("Video gallery must contain valid URLs.")
                .When(v => v.VideosGallery != null && v.VideosGallery.Any());
    }

    public async Task<bool> BeUniqueSlug(string slug, CancellationToken cancellationToken)
    {
        return !await _context.Blogs
            .AnyAsync(b => b.Slug == slug, cancellationToken);
    }

    public bool HaveValidImageUrls(List<string>? imageUrls)
    {
        if (imageUrls == null || !imageUrls.Any())
            return true;

        return imageUrls.All(url => !string.IsNullOrWhiteSpace(url) && url.Length <= 500);
    }

    public bool HaveValidVideoUrls(List<string>? videoUrls)
    {
        if (videoUrls == null || !videoUrls.Any())
            return true;

        return videoUrls.All(url => !string.IsNullOrWhiteSpace(url) && url.Length <= 500);
    }
}