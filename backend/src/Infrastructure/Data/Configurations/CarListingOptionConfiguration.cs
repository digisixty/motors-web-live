using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Data.Configurations;

public class CarListingOptionConfiguration : IEntityTypeConfiguration<CarListingOption>
{
    public void Configure(EntityTypeBuilder<CarListingOption> builder)
    {
        builder.Property(clo => clo.Value)
            .HasMaxLength(1000);

        // Configure relationships
        builder.HasOne(clo => clo.CarListing)
            .WithMany(cl => cl.CarListingOptions)
            .HasForeignKey(clo => clo.CarListingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(clo => clo.CarOption)
            .WithMany()
            .HasForeignKey(clo => clo.CarOptionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Create unique index to prevent duplicate car options for the same car listing
        builder.HasIndex(clo => new { clo.CarListingId, clo.CarOptionId })
            .IsUnique();
    }
}