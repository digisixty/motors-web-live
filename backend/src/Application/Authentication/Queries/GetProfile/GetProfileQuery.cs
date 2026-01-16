using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;

namespace MyApp.Application.Authentication.Queries.GetProfile;

[Authorize(Roles = Roles.Administrator)]
public record GetProfileQuery : IRequest<ProfileDto>;

public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, ProfileDto>
{
    private readonly IUser _currentUser;
    private readonly IIdentityService _identityService;

    public GetProfileQueryHandler(IUser currentUser, IIdentityService identityService)
    {
        _currentUser = currentUser;
        _identityService = identityService;
    }

    public async Task<ProfileDto> Handle(GetProfileQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.Id ?? throw new UnauthorizedAccessException("User not authenticated");

        var userName = await _identityService.GetUserNameAsync(userId);
        if (userName == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        var isAdmin = await _identityService.IsInRoleAsync(userId, Roles.Administrator);
        if (!isAdmin)
        {
            throw new UnauthorizedAccessException("Access denied. Administrator role required.");
        }

        return new ProfileDto
        {
            Id = userId,
            UserName = userName,
            Email = userName, // In this implementation, username = email
            Roles = new List<string> { Roles.Administrator }
        };
    }
}