using FluentValidation;
using MyApp.Application.Common.Interfaces;

namespace MyApp.Application.CarListings.Commands.DeleteCarListing;

public class DeleteCarListingCommandValidator : AbstractValidator<DeleteCarListingCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCarListingCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.Id)
            .GreaterThan(0)
            .MustAsync(CarListingExists)
                .WithMessage("Car listing must exist.")
                .WithErrorCode("NotFound");
    }

    public async Task<bool> CarListingExists(int id, CancellationToken cancellationToken)
    {
        return await _context.CarListings
            .AnyAsync(l => l.Id == id, cancellationToken);
    }
}