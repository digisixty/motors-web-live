using MyApp.Domain.Common;

namespace MyApp.Domain.Entities;

public class NewsletterSubscription : BaseAuditableEntity
{
    public string Email { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}
