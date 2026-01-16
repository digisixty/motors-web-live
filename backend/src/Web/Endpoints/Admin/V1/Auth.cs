using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.Authentication.Commands.AdminLogin;

namespace MyApp.Web.Endpoints.Admin.V1;

public class Auth : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(AdminLogin, "/login");
    }

    public async Task<Results<Ok<AdminLoginResponse>, BadRequest<AdminLoginResponse>>> AdminLogin(
        ISender sender,
        AdminLoginCommand command)
    {
        var response = await sender.Send(command);

        if (response.Success)
        {
            return TypedResults.Ok(response);
        }

        return TypedResults.BadRequest(response);
    }
}
