using MyApp.Domain.Common;
using MyApp.Domain.Enums;

namespace MyApp.Domain.Entities;

public class ContactSubmission : BaseAuditableEntity
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public ContactSubmissionType Type { get; set; } = ContactSubmissionType.Message;

    public string? ExtraDetails { get; set; }

  
    public bool IsProcessed { get; set; } = false;

    public DateTimeOffset? ProcessedAt { get; set; }

    public string? ProcessedBy { get; set; }
}