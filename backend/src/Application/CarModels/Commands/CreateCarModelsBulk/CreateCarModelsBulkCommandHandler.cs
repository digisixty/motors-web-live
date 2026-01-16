using MyApp.Application.Common.Interfaces;
using MyApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MyApp.Application.CarModels.Commands.CreateCarModelsBulk;

public class CreateCarModelsBulkCommandHandler : IRequestHandler<CreateCarModelsBulkCommand, CreateCarModelsBulkResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<CreateCarModelsBulkCommandHandler> _logger;

    public CreateCarModelsBulkCommandHandler(
        IApplicationDbContext context,
        ILogger<CreateCarModelsBulkCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<CreateCarModelsBulkResponse> Handle(CreateCarModelsBulkCommand request, CancellationToken cancellationToken)
    {
        var response = new CreateCarModelsBulkResponse
        {
            TotalProcessed = request.CarModels.Count
        };

        // Get all manufacturer IDs at once for validation
        var manufacturerIds = request.CarModels.Select(cm => cm.ManufacturerId).Distinct().ToList();
        var existingManufacturers = await _context.Manufacturers
            .Where(m => manufacturerIds.Contains(m.Id))
            .ToDictionaryAsync(m => m.Id, m => m.Title, cancellationToken);

        // Get existing slugs to avoid duplicates
        var requestSlugs = request.CarModels.Select(cm => cm.Slug.ToLower()).ToHashSet();
        var existingSlugs = await _context.CarModels
            .Where(cm => requestSlugs.Contains(cm.Slug.ToLower()))
            .Select(cm => cm.Slug.ToLower())
            .ToHashSetAsync(cancellationToken);

        var entitiesToAdd = new List<CarModel>();
        var errors = new List<CarModelBulkError>();

        for (int i = 0; i < request.CarModels.Count; i++)
        {
            var carModelRequest = request.CarModels[i];
            var itemErrors = new List<string>();

            // Validate manufacturer exists
            if (!existingManufacturers.ContainsKey(carModelRequest.ManufacturerId))
            {
                itemErrors.Add($"Manufacturer with ID {carModelRequest.ManufacturerId} does not exist");
            }

            // Validate slug uniqueness
            if (existingSlugs.Contains(carModelRequest.Slug.ToLower()))
            {
                itemErrors.Add($"Slug '{carModelRequest.Slug}' already exists");
            }

            if (itemErrors.Any())
            {
                errors.Add(new CarModelBulkError
                {
                    Index = i,
                    Name = carModelRequest.Name,
                    ErrorMessages = itemErrors
                });
                continue;
            }

            var entity = new CarModel
            {
                Name = carModelRequest.Name,
                Slug = carModelRequest.Slug,
                Image = carModelRequest.Image,
                ManufacturerId = carModelRequest.ManufacturerId
            };

            entitiesToAdd.Add(entity);
        }

        // Bulk insert all valid entities
        if (entitiesToAdd.Any())
        {
            _context.CarModels.AddRange(entitiesToAdd);

            try
            {
                await _context.SaveChangesAsync(cancellationToken);

                response.SuccessfulCount = entitiesToAdd.Count;
                response.SuccessfulIds = entitiesToAdd.Select(e => e.Id).ToList();

                _logger.LogInformation("Successfully created {Count} car models in bulk operation", entitiesToAdd.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during bulk car model creation");

                // Add all attempted entities as errors if the transaction failed
                foreach (var entity in entitiesToAdd)
                {
                    errors.Add(new CarModelBulkError
                    {
                        Index = request.CarModels.FindIndex(cm => cm.Slug == entity.Slug),
                        Name = entity.Name,
                        ErrorMessages = new List<string> { "Database insertion failed" }
                    });
                }
            }
        }

        response.Errors = errors;

        return response;
    }
}