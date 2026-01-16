using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.Sliders.Commands.CreateSlider;
using MyApp.Application.Sliders.Commands.DeleteSlider;
using MyApp.Application.Sliders.Commands.UpdateSlider;
using MyApp.Application.Sliders.Queries.GetSlidersList;
using MyApp.Application.Sliders.Queries.GetSlider;
using MyApp.Application.Sliders.Common;
using MyApp.Application.Common.Models;
using MyApp.Domain.Enums;

namespace MyApp.Web.Endpoints.Admin.V1;

public class Sliders : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetSliders).RequireAuthorization().WithName("AdminGetSliders");
        groupBuilder.MapGet(GetSliderById, "{id}").RequireAuthorization().WithName("AdminGetSliderById");
        groupBuilder.MapPost(CreateSlider).RequireAuthorization();
        groupBuilder.MapPut(UpdateSlider, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteSlider, "{id}").RequireAuthorization();
    }

    /// <summary>
    /// Get sliders with optional filtering
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="pageNumber">Page number for pagination (default: 1)</param>
    /// <param name="pageSize">Number of items per page (default: 10)</param>
    /// <param name="title">Filter by title (contains match)</param>
    /// <param name="isEnabled">Filter by enabled status (true/false)</param>
    /// <param name="placement">Filter by slider placement</param>
    /// <returns>Paginated list of sliders</returns>
    public async Task<Ok<PaginatedList<SliderDto>>> GetSliders(
        ISender sender,
        int? pageNumber = 1,
        int? pageSize = 10,
        string? title = null,
        bool? isEnabled = null,
        SliderPlacement? placement = null)
    {
        var slidersQuery = new GetSlidersListQuery
        {
            PageNumber = pageNumber ?? 1,
            PageSize = pageSize ?? 10,
            Title = title,
            IsEnabled = isEnabled,
            Placement = placement
        };

        var sliders = await sender.Send(slidersQuery);

        return TypedResults.Ok(sliders);
    }

    /// <summary>
    /// Get a slider by ID
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Slider ID</param>
    /// <returns>Slider details or 404 if not found</returns>
    public async Task<Results<Ok<SliderDto>, NotFound>> GetSliderById(ISender sender, int id)
    {
        var query = new GetSliderQuery { Id = id };
        var slider = await sender.Send(query);

        return slider is null ? TypedResults.NotFound() : TypedResults.Ok(slider);
    }

    /// <summary>
    /// Create a new slider
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="command">Create slider command</param>
    /// <returns>Created slider ID</returns>
    public async Task<Created<int>> CreateSlider(ISender sender, CreateSliderCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/sliders/{id}", id);
    }

    /// <summary>
    /// Update an existing slider
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Slider ID</param>
    /// <param name="command">Update slider command</param>
    /// <returns>204 No content or 404 Not Found</returns>
    public async Task<Results<NoContent, NotFound>> UpdateSlider(ISender sender, int id, UpdateSliderCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();

        await sender.Send(command);

        return TypedResults.NoContent();
    }

    /// <summary>
    /// Delete a slider
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Slider ID</param>
    /// <returns>204 No content or 404 Not Found</returns>
    public async Task<Results<NoContent, NotFound>> DeleteSlider(ISender sender, int id)
    {
        try
        {
            await sender.Send(new DeleteSliderCommand { Id = id });
            return TypedResults.NoContent();
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }
}