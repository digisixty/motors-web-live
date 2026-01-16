using FluentValidation;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.CarListings.Commands.CreateCarListing;

public class CreateCarListingCommandValidator : AbstractValidator<CreateCarListingCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateCarListingCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.VinNumber)
            .MaximumLength(17)
            .MustAsync(BeUniqueVinNumber)
                .WithMessage("VIN number must be unique when provided.")
                .WithErrorCode("Unique")
                .When(v => !string.IsNullOrEmpty(v.VinNumber));

        RuleFor(v => v.InteriorImages)
            .MaximumLength(2000);

        RuleFor(v => v.ExteriorImages)
            .MaximumLength(2000);

        RuleFor(v => v.Videos)
            .MaximumLength(2000);

        RuleFor(v => v.CustomPriceLabel)
            .MaximumLength(100);

        RuleFor(v => v.CardFooterLabel)
            .MaximumLength(100);

        RuleFor(v => v.MetaTags)
            .MaximumLength(1000);

        RuleFor(v => v.Description)
            .MaximumLength(5000);

        RuleForEach(v => v.CarAttributes)
            .ChildRules(attr =>
            {
                attr.RuleFor(x => x.CarAttributeId)
                    .GreaterThan(0)
                    .MustAsync(CarAttributeExists)
                        .WithMessage("Car attribute must exist.")
                        .WithErrorCode("NotFound");

                attr.RuleFor(x => x.Value)
                    .MaximumLength(500);
            });
    }

    
    public async Task<bool> BeUniqueVinNumber(string vinNumber, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(vinNumber))
            return true;

        return !await _context.CarListings
            .AnyAsync(l => l.VinNumber == vinNumber, cancellationToken);
    }

    public async Task<bool> CarAttributeExists(int carAttributeId, CancellationToken cancellationToken)
    {
        return await _context.CarAttributes
            .AnyAsync(a => a.Id == carAttributeId, cancellationToken);
    }
}