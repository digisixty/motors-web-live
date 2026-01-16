using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Data.Configurations;

public class StaticContentConfiguration : IEntityTypeConfiguration<StaticContent>
{
    public void Configure(EntityTypeBuilder<StaticContent> builder)
    {
        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.MainImage)
            .HasMaxLength(500);

        builder.Property(t => t.Description)
            .IsRequired();

        builder.Property(t => t.Slug)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasIndex(t => t.Slug)
            .IsUnique();
    }
}
