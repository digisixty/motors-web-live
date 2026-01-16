using MediatR;
using MyApp.Application.Common.Models;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.Users.Queries.GetUsersList;

public record GetUsersListQuery : IRequest<PaginatedList<UserListDto>>
{
    public int? PageNumber { get; init; } = 1;
    public int? PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public string? Role { get; init; }
}

public class GetUsersListQueryHandler : IRequestHandler<GetUsersListQuery, PaginatedList<UserListDto>>
{
    private readonly IIdentityService _identityService;

    public GetUsersListQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<PaginatedList<UserListDto>> Handle(GetUsersListQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.PageNumber ?? 1;
        var pageSize = request.PageSize ?? 10;

        var (users, totalCount) = await _identityService.GetUsersWithRolesAsync(
            pageNumber,
            pageSize,
            request.Search,
            request.Role);

        var userListDtos = users.Select(u => new UserListDto
        {
            Id = u.Id,
            UserName = u.UserName,
            Email = u.Email,
            EmailConfirmed = u.EmailConfirmed,
            Roles = u.Roles.Select(r => new RoleDto { Name = r }).ToList()
        }).ToList();

        return new PaginatedList<UserListDto>(userListDtos, totalCount, pageNumber, pageSize);
    }
}