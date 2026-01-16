using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MyApp.Application.Common.Models;
using MyApp.Application.CarModels.Commands.CreateCarModel;
using MyApp.Application.CarModels.Commands.CreateCarModelsBulk;
using MyApp.Application.CarModels.Commands.DeleteCarModel;
using MyApp.Application.CarModels.Commands.UpdateCarModel;
using MyApp.Application.CarModels.Queries.GetCarModels;
using MyApp.Application.CarModels.Queries.GetCarModelById;
using MyApp.Application.CarModels.Queries.GetCarModelsByManufacturer;
using MyApp.Application.CarModels.Common;

namespace MyApp.Web.Endpoints.Admin.V1;

public class CarModels : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCarModels).RequireAuthorization();
        groupBuilder.MapGet(GetCarModelById, "{id}").RequireAuthorization();
        groupBuilder.MapGet(GetCarModelsByManufacturer, "manufacturer/{manufacturerId}").RequireAuthorization();
        groupBuilder.MapPost(CreateCarModel).RequireAuthorization();
        groupBuilder.MapPost(CreateCarModelsBulk, "bulk").RequireAuthorization();
        groupBuilder.MapPut(UpdateCarModel, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteCarModel, "{id}").RequireAuthorization();
    }

    public async Task<Ok<PaginatedList<CarModelDto>>> GetCarModels(ISender sender, [FromQuery] int? pageNumber = null, [FromQuery] int? pageSize = null, [FromQuery] int? manufacturerId = null)
    {
        var query = new GetCarModelsQuery();

        if (pageNumber.HasValue)
            query = query with { PageNumber = pageNumber.Value };

        if (pageSize.HasValue)
            query = query with { PageSize = pageSize.Value };

        if (manufacturerId.HasValue)
            query = query with { ManufacturerId = manufacturerId.Value };

        var result = await sender.Send(query);
        return TypedResults.Ok(result);
    }

    public async Task<Results<Ok<CarModelDto>, NotFound>> GetCarModelById(ISender sender, int id)
    {
        var result = await sender.Send(new GetCarModelByIdQuery { Id = id });
        return TypedResults.Ok(result);
    }

    public async Task<Ok<List<CarModelDto>>> GetCarModelsByManufacturer(ISender sender, int manufacturerId)
    {
        var result = await sender.Send(new GetCarModelsByManufacturerQuery { ManufacturerId = manufacturerId });
        return TypedResults.Ok(result);
    }

    public async Task<Results<Created<int>, ValidationProblem>> CreateCarModel(ISender sender, CreateCarModelCommand command)
    {
        var result = await sender.Send(command);
        return TypedResults.Created($"/api/Admin/V1/CarModels/{result}", result);
    }

    public async Task<Results<Ok<CreateCarModelsBulkResponse>, ValidationProblem>> CreateCarModelsBulk(ISender sender, CreateCarModelsBulkCommand command)
    {
        var result = await sender.Send(command);
        return TypedResults.Ok(result);
    }

    public async Task<Results<NoContent, NotFound, ValidationProblem>> UpdateCarModel(ISender sender, int id, UpdateCarModelCommand command)
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

    public async Task<Results<NoContent, NotFound>> DeleteCarModel(ISender sender, int id)
    {
        await sender.Send(new DeleteCarModelCommand { Id = id });
        return TypedResults.NoContent();
    }
}