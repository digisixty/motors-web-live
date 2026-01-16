using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.CarAttributes.Commands.CreateCarAttribute;
using MyApp.Application.CarAttributes.Commands.DeleteCarAttribute;
using MyApp.Application.CarAttributes.Commands.UpdateCarAttribute;
using MyApp.Application.CarAttributes.Queries.GetCarAttributes;

namespace MyApp.Web.Endpoints.Admin.V1;

public class CarAttributes : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCarAttributes).RequireAuthorization();
        groupBuilder.MapPost(CreateCarAttribute).RequireAuthorization();
        groupBuilder.MapPut(UpdateCarAttribute, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteCarAttribute, "{id}").RequireAuthorization();
    }

    public async Task<Ok<List<CarAttributeDto>>> GetCarAttributes(ISender sender, int? parentId = null)
    {
        var carAttributes = await sender.Send(new GetCarAttributesQuery(parentId));

        return TypedResults.Ok(carAttributes);
    }

    public async Task<Created<int>> CreateCarAttribute(ISender sender, CreateCarAttributeCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/car-attributes/{id}", id);
    }

    public async Task<Results<NoContent, NotFound>> UpdateCarAttribute(ISender sender, int id, UpdateCarAttributeCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();

        await sender.Send(command);

        return TypedResults.NoContent();
    }

    public async Task<Results<NoContent, NotFound>> DeleteCarAttribute(ISender sender, int id)
    {
        await sender.Send(new DeleteCarAttributeCommand { Id = id });

        return TypedResults.NoContent();
    }
}
