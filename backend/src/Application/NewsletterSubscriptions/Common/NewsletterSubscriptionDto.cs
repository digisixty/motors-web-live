namespace MyApp.Application.NewsletterSubscriptions.Common;

public class NewsletterSubscriptionDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTimeOffset Created { get; set; }
    public DateTimeOffset LastModified { get; set; }
}

public class NewsletterSubscriptionListDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTimeOffset Created { get; set; }
}
