using FluentValidation;

namespace MyApp.Application.CarModels.Commands.CreateCarModelsBulk;

public class CreateCarModelsBulkCommandValidator : AbstractValidator<CreateCarModelsBulkCommand>
{
    public CreateCarModelsBulkCommandValidator()
    {
        RuleFor(v => v.CarModels)
            .NotEmpty()
            .WithMessage("At least one car model must be provided")
            .Must(models => models.Count <= 10000)
            .WithMessage("Maximum 10000 car models can be processed in a single request");

        RuleForEach(v => v.CarModels).SetValidator(new CarModelBulkCreateRequestValidator());
    }
}

public class CarModelBulkCreateRequestValidator : AbstractValidator<CarModelBulkCreateRequest>
{
    public CarModelBulkCreateRequestValidator()
    {
        RuleFor(v => v.Name)
            .NotEmpty()
            .MaximumLength(200)
            .WithMessage("Name is required and must not exceed 200 characters");

        RuleFor(v => v.Slug)
            .NotEmpty()
            .MaximumLength(200)
            .Matches(@"^[a-z0-9-]+$")
            .WithMessage("Slug can only contain lowercase letters, numbers, and hyphens");

        RuleFor(v => v.Image)
            .MaximumLength(500)
            .WithMessage("Image URL must not exceed 500 characters");

        RuleFor(v => v.ManufacturerId)
            .GreaterThan(0)
            .WithMessage("Manufacturer ID must be greater than 0");
    }
}