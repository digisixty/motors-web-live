namespace MyApp.Application.Users.Queries.GetUsersList;

public record UserListDto
{
    public string Id { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public bool EmailConfirmed { get; init; }
    public List<RoleDto> Roles { get; init; } = new();
}

public record RoleDto
{
    public string Name { get; init; } = string.Empty;
}