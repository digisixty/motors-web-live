using MyApp.Domain.Entities;
using MyApp.Domain.Enums;

namespace MyApp.Application.ContactSubmissions.Common;

public class ContactSubmissionDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public ContactSubmissionType Type { get; set; }
    public string? ExtraDetails { get; set; }
    public bool IsProcessed { get; set; }
    public DateTimeOffset? ProcessedAt { get; set; }
    public string? ProcessedBy { get; set; }
    public DateTimeOffset Created { get; set; }
    public DateTimeOffset LastModified { get; set; }
}

public class ContactSubmissionListDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public ContactSubmissionType Type { get; set; }
    public bool IsProcessed { get; set; }
    public DateTimeOffset Created { get; set; }
}