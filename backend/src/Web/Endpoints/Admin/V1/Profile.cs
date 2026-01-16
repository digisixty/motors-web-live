using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.Authentication.Queries.GetProfile;

namespace MyApp.Web.Endpoints.Admin.V1;

public class Profile : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetProfile).RequireAuthorization();
    }

    public async Task<Ok<ProfileDto>> GetProfile(ISender sender)
    {
        var profile = await sender.Send(new GetProfileQuery());

        return TypedResults.Ok(profile);
    }
}