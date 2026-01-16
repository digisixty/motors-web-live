using System.ComponentModel.DataAnnotations;
using FluentValidation;
using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Domain.Entities;

namespace MyApp.Application.NewsletterSubscriptions.Commands.CreateNewsletterSubscription;

public record CreateNewsletterSubscriptionCommand : IRequest<int>
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string RecaptchaToken { get; init; } = string.Empty;
}

public class CreateNewsletterSubscriptionCommandHandler : IRequestHandler<CreateNewsletterSubscriptionCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IRecaptchaService _recaptchaService;

    public CreateNewsletterSubscriptionCommandHandler(
        IApplicationDbContext context,
        IRecaptchaService recaptchaService)
    {
        _context = context;
        _recaptchaService = recaptchaService;
    }

    public async Task<int> Handle(CreateNewsletterSubscriptionCommand request, CancellationToken cancellationToken)
    {
        // Validate reCAPTCHA token
        var isValidRecaptcha = await _recaptchaService.ValidateTokenAsync(request.RecaptchaToken, cancellationToken);
        if (!isValidRecaptcha)
        {
            throw new FluentValidation.ValidationException("Invalid reCAPTCHA token");
        }

        // Check if email already exists
        var existingSubscription = await _context.NewsletterSubscriptions
            .Where(x => x.Email == request.Email)
            .FirstOrDefaultAsync(cancellationToken);

        if (existingSubscription != null)
        {
            // If email already exists, return the existing ID without error
            return existingSubscription.Id;
        }

        var entity = new NewsletterSubscription
        {
            Email = request.Email,
            IsActive = true
        };

        _context.NewsletterSubscriptions.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
