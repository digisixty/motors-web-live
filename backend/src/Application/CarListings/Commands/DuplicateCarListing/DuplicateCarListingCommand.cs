using MediatR;
using MyApp.Application.Common.Interfaces;
using MyApp.Application.Common.Security;
using MyApp.Domain.Constants;
using MyApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Application.CarListings.Commands.DuplicateCarListing;

[Authorize(Roles = Roles.Administrator)]
public record DuplicateCarListingCommand : IRequest<int>
{
    public int Id { get; init; }
}

public class DuplicateCarListingCommandHandler : IRequestHandler<DuplicateCarListingCommand, int>
{
    private readonly IApplicationDbContext _context;

    public DuplicateCarListingCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(DuplicateCarListingCommand request, CancellationToken cancellationToken)
    {
        // Get the original car listing with all related data
        var originalListing = await _context.CarListings
            .Include(cl => cl.CarListingAttributes)
            .Include(cl => cl.CarListingOptions)
            .FirstOrDefaultAsync(cl => cl.Id == request.Id, cancellationToken);

        if (originalListing == null)
        {
            throw new KeyNotFoundException($"Car listing with ID {request.Id} not found.");
        }

        // Generate new stock number and slug
        var newStockNumber = await GenerateUniqueStockNumber(cancellationToken);
        var newSlug = await GenerateUniqueSlug(newStockNumber, cancellationToken);

        // Create the duplicate car listing
        var duplicateListing = new CarListing
        {
            StockNumber = newStockNumber,
            Slug = newSlug,
            VinNumber = originalListing.VinNumber,
            RegistrationDate = originalListing.RegistrationDate,
            PrimaryImage = originalListing.PrimaryImage,
            InteriorImages = originalListing.InteriorImages,
            ExteriorImages = originalListing.ExteriorImages,
            Videos = originalListing.Videos,
            Price = originalListing.Price,
            SalePrice = originalListing.SalePrice,
            IsSold = false, // Reset sold status for the duplicate
            CustomPriceLabel = originalListing.CustomPriceLabel,
            IsSpecialOffer = originalListing.IsSpecialOffer,
            ManufacturerId = originalListing.ManufacturerId,
            CarModelId = originalListing.CarModelId
        };

        // Duplicate all attributes
        foreach (var attr in originalListing.CarListingAttributes)
        {
            duplicateListing.CarListingAttributes.Add(new CarListingAttribute
            {
                CarAttributeId = attr.CarAttributeId,
                Value = attr.Value
            });
        }

        // Duplicate all options
        foreach (var opt in originalListing.CarListingOptions)
        {
            duplicateListing.CarListingOptions.Add(new CarListingOption
            {
                CarOptionId = opt.CarOptionId,
                Value = opt.Value
            });
        }

        _context.CarListings.Add(duplicateListing);
        await _context.SaveChangesAsync(cancellationToken);

        return duplicateListing.Id;
    }

    private async Task<string> GenerateUniqueStockNumber(CancellationToken cancellationToken)
    {
        var random = new Random();
        var maxAttempts = 100;
        var attempts = 0;

        do
        {
            var stockNumber = GenerateRandomStockNumber(random);

            // Check if this stock number already exists
            var exists = await _context.CarListings
                .AnyAsync(cl => cl.StockNumber == stockNumber, cancellationToken);

            if (!exists)
            {
                return stockNumber;
            }

            attempts++;
        } while (attempts < maxAttempts);

        // Fallback in case of extreme unlikelihood (all MOT + 6 digit combinations are taken)
        // Use timestamp + random to ensure uniqueness
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
        var randomSuffix = random.Next(100, 999).ToString();
        var digits = (timestamp + randomSuffix)[..6]; // Ensure we have 6 digits
        return $"MOT-{digits}";
    }

    private async Task<string> GenerateUniqueSlug(string stockNumber, CancellationToken cancellationToken)
    {
        var baseSlug = GenerateSlugFromStockNumber(stockNumber);
        var slug = baseSlug;
        var counter = 1;

        // Keep adding counter until we find a unique slug
        while (await _context.CarListings
            .AnyAsync(cl => cl.Slug == slug, cancellationToken))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
    }

    private static string GenerateSlugFromStockNumber(string stockNumber)
    {
        // Convert stock number to a URL-friendly slug
        // Example: "MOT-123456" -> "mot-123456"
        return stockNumber.ToLowerInvariant().Replace('_', '-');
    }

    private static string GenerateRandomStockNumber(Random random)
    {
        // Generate 6 random digits
        var digits = new char[6];
        for (int i = 0; i < 6; i++)
        {
            digits[i] = (char)('0' + random.Next(10));
        }

        return $"MOT-{new string(digits)}";
    }
}