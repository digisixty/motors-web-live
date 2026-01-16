using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Data.Configurations;

public class CarOptionConfiguration : IEntityTypeConfiguration<CarOption>
{
    public void Configure(EntityTypeBuilder<CarOption> builder)
    {
        builder.Property(co => co.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(co => co.Slug)
            .HasMaxLength(200)
            .IsRequired();

        // Ensure slug is unique
        builder.HasIndex(co => co.Slug)
            .IsUnique();

        builder.Property(co => co.Image)
            .HasMaxLength(1000);

        builder.Property(co => co.Icon)
            .HasMaxLength(1000);

        builder.Property(co => co.Description)
            .HasMaxLength(1000);

        // Configure self-referencing relationship for hierarchical structure
        builder.HasOne(co => co.Parent)
            .WithMany(co => co.Children)
            .HasForeignKey(co => co.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Add index for ParentId for better performance in hierarchical queries
        builder.HasIndex(co => co.ParentId);
    }
}