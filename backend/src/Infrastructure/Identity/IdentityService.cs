using Microsoft.Extensions.Configuration;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Models;
using MyApp.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyApp.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
    private readonly IAuthorizationService _authorizationService;
    private readonly IConfiguration _configuration;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
        IAuthorizationService authorizationService,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
        _authorizationService = authorizationService;
        _configuration = configuration;
    }

    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        return user?.UserName;
    }

    public async Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password, string? firstName = null, string? lastName = null)
    {
        var user = new ApplicationUser
        {
            UserName = userName,
            Email = userName,
            FirstName = firstName,
            LastName = lastName,
        };

        var result = await _userManager.CreateAsync(user, password);

        return (result.ToApplicationResult(), user.Id);
    }

    public async Task<(Result Result, string UserId)> CreateUserWithRoleAsync(string userName, string password, string? role = null)
    {
        var user = new ApplicationUser
        {
            UserName = userName,
            Email = userName,
        };

        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            return (result.ToApplicationResult(), string.Empty);
        }

        // Add role if specified
        if (!string.IsNullOrEmpty(role))
        {
            var roleResult = await _userManager.AddToRoleAsync(user, role);
            if (!roleResult.Succeeded)
            {
                // Rollback user creation if role assignment fails
                await _userManager.DeleteAsync(user);
                return (roleResult.ToApplicationResult(), string.Empty);
            }
        }

        return (Result.Success(), user.Id);
    }

    public async Task<(Result Result, string Token)> LoginAsync(string userName, string password)
    {
        var user = await _userManager.FindByNameAsync(userName);

        if (user == null)
        {
            return (Result.Failure(new[] { "Invalid username or password." }), string.Empty);
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, password);

        if (!isPasswordValid)
        {
            return (Result.Failure(new[] { "Invalid username or password." }), string.Empty);
        }

        // Check if user is in Administrator role
        var isAdmin = await _userManager.IsInRoleAsync(user, "Administrator");

        if (!isAdmin)
        {
            return (Result.Failure(new[] { "Access denied. Administrator role required." }), string.Empty);
        }

        // Generate JWT token
        var principal = await _userClaimsPrincipalFactory.CreateAsync(user);

        // For simplicity, we'll use ASP.NET Core Identity's built-in token generation
        // In a real scenario, you might want to use a more sophisticated JWT generation
        var token = await GenerateJwtToken(user, principal);

        return (Result.Success(), token);
    }

    public async Task<(Result Result, string Token)> UserLoginAsync(string userName, string password)
    {
        var user = await _userManager.FindByNameAsync(userName);

        if (user == null)
        {
            return (Result.Failure(new[] { "Invalid username or password." }), string.Empty);
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, password);

        if (!isPasswordValid)
        {
            return (Result.Failure(new[] { "Invalid username or password." }), string.Empty);
        }

        // Generate JWT token
        var principal = await _userClaimsPrincipalFactory.CreateAsync(user);

        // Get user roles
        var roles = await _userManager.GetRolesAsync(user);

        var token = await GenerateJwtToken(user, principal, roles);

        return (Result.Success(), token);
    }

    private async Task<string> GenerateJwtToken(ApplicationUser user, ClaimsPrincipal principal, IList<string>? roles = null)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secret = jwtSettings["Secret"];
        var expiryMinutes = jwtSettings.GetValue<int>("ExpiryMinutes");

        if (string.IsNullOrEmpty(secret))
        {
            throw new InvalidOperationException("JWT Secret not configured.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Name, user.UserName ?? string.Empty),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.Email, user.Email ?? string.Empty)
        };

        // Add roles if provided
        if (roles != null && roles.Count > 0)
        {
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
        }
        else
        {
            // Default to Administrator if no roles provided (for admin login)
            claims.Add(new Claim(ClaimTypes.Role, "Administrator"));
        }

        // Add any additional claims from the principal
        var additionalClaims = principal.Claims.Where(c => !claims.Any(existing => existing.Type == c.Type));
        claims.AddRange(additionalClaims);

        var token = new JwtSecurityToken(
            issuer: null,
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);

        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return false;
        }

        var principal = await _userClaimsPrincipalFactory.CreateAsync(user);

        var result = await _authorizationService.AuthorizeAsync(principal, policyName);

        return result.Succeeded;
    }

    public async Task<Result> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        return user != null ? await DeleteUserAsync(user) : Result.Success();
    }

    public async Task<Result> DeleteUserAsync(ApplicationUser user)
    {
        var result = await _userManager.DeleteAsync(user);

        return result.ToApplicationResult();
    }

    public async Task<(List<UserWithRolesDto> Users, int TotalCount)> GetUsersWithRolesAsync(int pageNumber, int pageSize, string? search = null, string? role = null)
    {
        var query = _userManager.Users.AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(u =>
                u.UserName != null && u.UserName.Contains(search) ||
                u.Email != null && u.Email.Contains(search));
        }

        var users = await query
            .OrderByDescending(u => u.Id)
            .ToListAsync();

        // Get user roles
        var userDtos = new List<UserWithRolesDto>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);

            userDtos.Add(new UserWithRolesDto
            {
                Id = user.Id,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                EmailConfirmed = user.EmailConfirmed,
                Roles = roles.ToList()
            });
        }

        // Apply role filter if specified
        if (!string.IsNullOrWhiteSpace(role))
        {
            userDtos = userDtos
                .Where(u => u.Roles.Any(r => r.Equals(role, StringComparison.OrdinalIgnoreCase)))
                .ToList();
        }

        var totalCount = userDtos.Count;
        var pagedUsers = userDtos
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return (pagedUsers, totalCount);
    }

    public async Task<UserWithRolesDto?> GetUserByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return null;

        var roles = await _userManager.GetRolesAsync(user);

        return new UserWithRolesDto
        {
            Id = user.Id,
            UserName = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            EmailConfirmed = user.EmailConfirmed,
            Roles = roles.ToList()
        };
    }

    public async Task<(Result Result, string UserId)> UpdateUserAsync(string userId, string? email = null, bool? emailConfirmed = null, string? role = null)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return (Result.Failure(new[] { "User not found." }), string.Empty);
        }

        var hasChanges = false;

        // Handle email update (including null to remove email)
        if (email != user.Email)
        {
            // Check if email is being set to a non-null/non-empty value
            if (!string.IsNullOrEmpty(email))
            {
                var existingUser = await _userManager.FindByEmailAsync(email);
                if (existingUser != null)
                {
                    return (Result.Failure(new[] { "Email is already in use." }), string.Empty);
                }

                // Also check if username is already taken (since email = username)
                var existingUserByName = await _userManager.FindByNameAsync(email);
                if (existingUserByName != null && existingUserByName.Id != user.Id)
                {
                    return (Result.Failure(new[] { "Username (email) is already in use." }), string.Empty);
                }

                user.Email = email;
                user.NormalizedEmail = _userManager.NormalizeEmail(email);
                // Update username to match email (since emails are usernames)
                user.UserName = email;
                user.NormalizedUserName = _userManager.NormalizeName(email);
            }
            else
            {
                // Set email and username to null/empty
                user.Email = null;
                user.NormalizedEmail = null;
                user.UserName = null;
                user.NormalizedUserName = null;
            }
            hasChanges = true;
        }

        if (emailConfirmed.HasValue && user.EmailConfirmed != emailConfirmed.Value)
        {
            user.EmailConfirmed = emailConfirmed.Value;
            hasChanges = true;
        }

        // Handle role update - always process since role parameter is always provided
        // Null or empty or "none" means remove all roles, otherwise assign the specified role

        // Get current roles
        var currentRoles = await _userManager.GetRolesAsync(user);

        // Remove all current roles
        var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
        {
            var errors = removeResult.Errors.Select(e => e.Description);
            return (Result.Failure(errors), string.Empty);
        }

        // Add new role if specified and not null/empty/none
        if (!string.IsNullOrEmpty(role) && role != "none")
        {
            var addResult = await _userManager.AddToRoleAsync(user, role);
            if (!addResult.Succeeded)
            {
                var errors = addResult.Errors.Select(e => e.Description);
                return (Result.Failure(errors), string.Empty);
            }
        }
        hasChanges = true;

        if (!hasChanges)
        {
            return (Result.Success(), user.Id);
        }

        var updateResult = await _userManager.UpdateAsync(user);

        if (!updateResult.Succeeded)
        {
            var errors = updateResult.Errors.Select(e => e.Description);
            return (Result.Failure(errors), string.Empty);
        }

        return (Result.Success(), user.Id);
    }
}
