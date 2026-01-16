using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Data.Configurations;

public class CarListingConfiguration : IEntityTypeConfiguration<CarListing>
{
    public void Configure(EntityTypeBuilder<CarListing> builder)
    {
        builder.Property(cl => cl.StockNumber)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(cl => cl.Slug)
            .HasMaxLength(200)
            .IsRequired();

        // Ensure slug is unique
        builder.HasIndex(cl => cl.Slug)
            .IsUnique();

        builder.Property(cl => cl.VinNumber)
            .HasMaxLength(50);

        builder.Property(cl => cl.PrimaryImage)
            .HasMaxLength(1000);

        builder.Property(cl => cl.InteriorImages)
            .HasMaxLength(2000);

        builder.Property(cl => cl.ExteriorImages)
            .HasMaxLength(2000);

        builder.Property(cl => cl.Videos)
            .HasMaxLength(2000);

        builder.Property(cl => cl.MetaTags)
            .HasMaxLength(1000);

        builder.Property(cl => cl.CustomPriceLabel)
            .HasMaxLength(100);

        builder.Property(cl => cl.Price)
            .HasColumnType("decimal(18,2)");

        builder.Property(cl => cl.SalePrice)
            .HasColumnType("decimal(18,2)");

        // Configure relationships
        builder.HasOne(cl => cl.Manufacturer)
            .WithMany()
            .HasForeignKey(cl => cl.ManufacturerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(cl => cl.CarModel)
            .WithMany()
            .HasForeignKey(cl => cl.CarModelId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(cl => cl.CarListingAttributes)
            .WithOne(cla => cla.CarListing)
            .HasForeignKey(cla => cla.CarListingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(cl => cl.CarListingOptions)
            .WithOne(clo => clo.CarListing)
            .HasForeignKey(clo => clo.CarListingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}