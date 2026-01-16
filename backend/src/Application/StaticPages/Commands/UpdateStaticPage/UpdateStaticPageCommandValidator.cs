using FluentValidation;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.StaticPages.Commands.UpdateStaticPage;

public class UpdateStaticPageCommandValidator : AbstractValidator<UpdateStaticPageCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateStaticPageCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.Id)
            .GreaterThan(0)
            .WithMessage("Id must be greater than 0.");

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

        RuleFor(v => v.Content)
            .MaximumLength(10000)
            .WithMessage("Content cannot exceed 10000 characters.");

        RuleFor(v => v.Excerpt)
            .MaximumLength(500)
            .WithMessage("Excerpt cannot exceed 500 characters.");

        RuleFor(v => v.CoverImage)
            .MaximumLength(500)
            .WithMessage("Cover image URL cannot exceed 500 characters.");

        RuleFor(v => v.MetaTitle)
            .MaximumLength(200)
            .WithMessage("Meta title cannot exceed 200 characters.");

        RuleFor(v => v.MetaDescription)
            .MaximumLength(500)
            .WithMessage("Meta description cannot exceed 500 characters.");

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

    public async Task<bool> BeUniqueSlug(UpdateStaticPageCommand request, string slug, CancellationToken cancellationToken)
    {
        return !await _context.StaticPages
            .AnyAsync(p => p.Slug == slug && p.Id != request.Id, cancellationToken);
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