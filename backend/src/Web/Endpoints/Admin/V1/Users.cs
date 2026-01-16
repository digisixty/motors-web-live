using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.Common.Models;
using MyApp.Application.Users.Commands.CreateUser;
using MyApp.Application.Users.Commands.UpdateUser;
using MyApp.Application.Users.Commands.DeleteUser;
using MyApp.Application.Users.Queries.GetUsersList;
using MyApp.Application.Users.Queries.GetUserById;

namespace MyApp.Web.Endpoints.Admin.V1;

public class Users : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(CreateUser, "/create");
        groupBuilder.MapGet(GetUsersList, "");
        groupBuilder.MapGet(GetUserById, "/{id}");
        groupBuilder.MapPut(UpdateUser, "/{id}");
        groupBuilder.MapDelete(DeleteUser, "/{id}");
    }

    public async Task<Results<Ok<CreateUserResponse>, BadRequest<CreateUserResponse>>> CreateUser(
        ISender sender,
        CreateUserCommand command)
    {
        var response = await sender.Send(command);

        if (response.Success)
        {
            return TypedResults.Ok(response);
        }

        return TypedResults.BadRequest(response);
    }

    public async Task<Ok<PaginatedList<UserListDto>>> GetUsersList(
        ISender sender,
        int? pageNumber,
        int? pageSize,
        string? search,
        string? role)
    {
        var query = new GetUsersListQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            Search = search,
            Role = role
        };

        var result = await sender.Send(query);

        return TypedResults.Ok(result);
    }

    public async Task<Results<Ok<UserWithRolesDto>, NotFound>> GetUserById(
        ISender sender,
        string id)
    {
        var query = new GetUserByIdQuery { Id = id };
        var user = await sender.Send(query);

        if (user == null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(user);
    }

    public async Task<Results<Ok<UpdateUserResponse>, BadRequest<UpdateUserResponse>>> UpdateUser(
        ISender sender,
        string id,
        UpdateUserCommand command)
    {
        var commandWithId = command with { Id = id };
        var response = await sender.Send(commandWithId);

        if (response.Success)
        {
            return TypedResults.Ok(response);
        }

        return TypedResults.BadRequest(response);
    }

    public async Task<Results<Ok<DeleteUserResponse>, BadRequest<DeleteUserResponse>>> DeleteUser(
        ISender sender,
        string id)
    {
        var command = new DeleteUserCommand { Id = id };
        var response = await sender.Send(command);

        if (response.Success)
        {
            return TypedResults.Ok(response);
        }

        return TypedResults.BadRequest(response);
    }
}