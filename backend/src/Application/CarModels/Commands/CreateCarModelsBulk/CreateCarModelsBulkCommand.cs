using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MediatR;

namespace MyApp.Application.CarModels.Commands.CreateCarModelsBulk;

[Authorize(Roles = Roles.Administrator)]
public record CreateCarModelsBulkCommand : IRequest<CreateCarModelsBulkResponse>
{
    public List<CarModelBulkCreateRequest> CarModels { get; init; } = new();
}

public record CarModelBulkCreateRequest
{
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Image { get; init; }
    public int ManufacturerId { get; init; }
}

public record CreateCarModelsBulkResponse
{
    public int TotalProcessed { get; set; }
    public int SuccessfulCount { get; set; }
    public List<int> SuccessfulIds { get; set; } = new();
    public List<CarModelBulkError> Errors { get; set; } = new();
}

public record CarModelBulkError
{
    public int Index { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<string> ErrorMessages { get; set; } = new();
}