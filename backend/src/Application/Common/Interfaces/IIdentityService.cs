using MyApp.Application.Common.Models;

namespace MyApp.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);

    Task<bool> IsInRoleAsync(string userId, string role);

    Task<bool> AuthorizeAsync(string userId, string policyName);

    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password, string? firstName = null, string? lastName = null);

    Task<(Result Result, string UserId)> CreateUserWithRoleAsync(string userName, string password, string? role = null);

    Task<(Result Result, string Token)> LoginAsync(string userName, string password);

    Task<(Result Result, string Token)> UserLoginAsync(string userName, string password);

    Task<Result> DeleteUserAsync(string userId);

    Task<(List<UserWithRolesDto> Users, int TotalCount)> GetUsersWithRolesAsync(int pageNumber, int pageSize, string? search = null, string? role = null);

    Task<UserWithRolesDto?> GetUserByIdAsync(string userId);

    Task<(Result Result, string UserId)> UpdateUserAsync(string userId, string? email = null, bool? emailConfirmed = null, string? role = null);
}
