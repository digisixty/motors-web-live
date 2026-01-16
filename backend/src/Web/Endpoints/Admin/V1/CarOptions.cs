using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.CarOptions.Commands.CreateCarOption;
using MyApp.Application.CarOptions.Commands.DeleteCarOption;
using MyApp.Application.CarOptions.Commands.UpdateCarOption;
using MyApp.Application.CarOptions.Queries.GetCarOptions;

namespace MyApp.Web.Endpoints.Admin.V1;

public class CarOptions : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCarOptions).RequireAuthorization();
        groupBuilder.MapPost(CreateCarOption).RequireAuthorization();
        groupBuilder.MapPut(UpdateCarOption, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteCarOption, "{id}").RequireAuthorization();
    }

    public async Task<Ok<List<CarOptionDto>>> GetCarOptions(ISender sender, int? parentId = null)
    {
        var carOptions = await sender.Send(new GetCarOptionsQuery(parentId));

        return TypedResults.Ok(carOptions);
    }

    public async Task<Created<int>> CreateCarOption(ISender sender, CreateCarOptionCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/car-options/{id}", id);
    }

    public async Task<Results<NoContent, NotFound>> UpdateCarOption(ISender sender, int id, UpdateCarOptionCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();

        await sender.Send(command);

        return TypedResults.NoContent();
    }

    public async Task<Results<NoContent, NotFound>> DeleteCarOption(ISender sender, int id)
    {
        await sender.Send(new DeleteCarOptionCommand { Id = id });

        return TypedResults.NoContent();
    }
}