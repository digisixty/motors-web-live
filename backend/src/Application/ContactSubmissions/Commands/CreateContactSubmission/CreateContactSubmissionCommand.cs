using System.ComponentModel.DataAnnotations;
using FluentValidation;
using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Entities;
using MyApp.Domain.Enums;

namespace MyApp.Application.ContactSubmissions.Commands.CreateContactSubmission;

public record CreateContactSubmissionCommand : IRequest<int>
{
    [Required]
    [MaxLength(200)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Message { get; init; } = string.Empty;

    [Required]
    public ContactSubmissionType Type { get; init; } = ContactSubmissionType.Message;

    [MaxLength(1000)]
    public string? ExtraDetails { get; init; }

    [Required]
    [MaxLength(5000)]
    public string RecaptchaToken { get; init; } = string.Empty;
}

public class CreateContactSubmissionCommandHandler : IRequestHandler<CreateContactSubmissionCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IRecaptchaService _recaptchaService;

    public CreateContactSubmissionCommandHandler(
        IApplicationDbContext context,
        IRecaptchaService recaptchaService)
    {
        _context = context;
        _recaptchaService = recaptchaService;
    }

    public async Task<int> Handle(CreateContactSubmissionCommand request, CancellationToken cancellationToken)
    {
        // Validate reCAPTCHA token
        var isValidRecaptcha = await _recaptchaService.ValidateTokenAsync(request.RecaptchaToken, cancellationToken);
        if (!isValidRecaptcha)
        {
            throw new FluentValidation.ValidationException("Invalid reCAPTCHA token");
        }

        var entity = new ContactSubmission
        {
            FullName = request.FullName,
            Email = request.Email,
            Message = request.Message,
            Type = request.Type,
            ExtraDetails = request.ExtraDetails,
            IsProcessed = false
        };

        _context.ContactSubmissions.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
