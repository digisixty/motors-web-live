using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.Manufacturers.Commands.CreateManufacturer;
using MyApp.Application.Manufacturers.Commands.DeleteManufacturer;
using MyApp.Application.Manufacturers.Commands.UpdateManufacturer;
using MyApp.Application.Manufacturers.Queries.GetManufacturers;
using MyApp.Application.Manufacturers.Queries.GetManufacturerById;
using MyApp.Application.Manufacturers.Common;

namespace MyApp.Web.Endpoints.Admin.V1;

public class Manufacturers : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetManufacturers).RequireAuthorization();
        groupBuilder.MapGet(GetManufacturerById, "{id}").RequireAuthorization();
        groupBuilder.MapPost(CreateManufacturer).RequireAuthorization();
        groupBuilder.MapPut(UpdateManufacturer, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteManufacturer, "{id}").RequireAuthorization();
    }

    public async Task<Ok<List<ManufacturerDto>>> GetManufacturers(ISender sender)
    {
        var result = await sender.Send(new GetManufacturersQuery());
        return TypedResults.Ok(result);
    }

    public async Task<Results<Ok<ManufacturerDto>, NotFound>> GetManufacturerById(ISender sender, int id)
    {
        var result = await sender.Send(new GetManufacturerByIdQuery { Id = id });
        return TypedResults.Ok(result);
    }

    public async Task<Results<Created<int>, ValidationProblem>> CreateManufacturer(ISender sender, CreateManufacturerCommand command)
    {
        var result = await sender.Send(command);
        return TypedResults.Created($"/api/Admin/V1/Manufacturers/{result}", result);
    }

    public async Task<Results<NoContent, NotFound, ValidationProblem>> UpdateManufacturer(ISender sender, int id, UpdateManufacturerCommand command)
    {
        if (id != command.Id)
        {
            return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            {
                { "Id", new[] { "ID in URL does not match ID in request body" } }
            });
        }

        await sender.Send(command);
        return TypedResults.NoContent();
    }

    public async Task<Results<NoContent, NotFound>> DeleteManufacturer(ISender sender, int id)
    {
        await sender.Send(new DeleteManufacturerCommand { Id = id });
        return TypedResults.NoContent();
    }
}