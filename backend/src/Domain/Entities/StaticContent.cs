namespace MyApp.Domain.Entities;

public class StaticContent : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;

    public string? MainImage { get; set; }

    public string Description { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;
}
