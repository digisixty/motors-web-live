using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.Common.Models;
using MyApp.Application.Images.Commands.CreateImage;
using MyApp.Application.Images.Commands.DeleteImage;
using MyApp.Application.Images.Queries.GetImages;

namespace MyApp.Web.Endpoints.Admin.V1;

public class Images : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost("/", UploadImage).RequireAuthorization().DisableAntiforgery();
        groupBuilder.MapGet("/", GetImages).RequireAuthorization();
        groupBuilder.MapDelete("/{id}", DeleteImage).RequireAuthorization();
    }

    public async Task<Created<int>> UploadImage(ISender sender, IFormFile file, string? description = null, string? altText = null, string? folderPath = null)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is required and cannot be empty.");
        }

        var command = new CreateImageCommand
        {
            FileStream = file.OpenReadStream(),
            FileName = file.FileName,
            ContentType = file.ContentType,
            FileSize = file.Length,
            Description = description,
            AltText = altText,
            FolderPath = folderPath
        };

        var id = await sender.Send(command);

        return TypedResults.Created($"/images/{id}", id);
    }

    public async Task<Ok<PaginatedList<ImageDto>>> GetImages(
        ISender sender,
        int pageNumber = 1,
        int pageSize = 20,
        string? searchTerm = null,
        string? folderPath = null,
        string? contentType = null)
    {
        var query = new GetImagesQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            SearchTerm = searchTerm,
            FolderPath = folderPath,
            ContentType = contentType
        };

        var images = await sender.Send(query);

        return TypedResults.Ok(images);
    }

    public async Task<NoContent> DeleteImage(ISender sender, int id)
    {
        var command = new DeleteImageCommand { Id = id };
        await sender.Send(command);

        return TypedResults.NoContent();
    }
}
