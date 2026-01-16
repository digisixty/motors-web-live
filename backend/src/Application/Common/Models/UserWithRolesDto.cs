namespace MyApp.Application.Common.Models;

public record UserWithRolesDto
{
    public string Id { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public bool EmailConfirmed { get; init; }
    public List<string> Roles { get; init; } = new();
}