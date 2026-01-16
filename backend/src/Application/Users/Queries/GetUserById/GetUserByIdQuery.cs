using MediatR;
using MyApp.Application.Common.Models;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.Users.Queries.GetUserById;

public record GetUserByIdQuery : IRequest<UserWithRolesDto?>
{
    public string Id { get; init; } = string.Empty;
}

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserWithRolesDto?>
{
    private readonly IIdentityService _identityService;

    public GetUserByIdQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<UserWithRolesDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        return await _identityService.GetUserByIdAsync(request.Id);
    }
}