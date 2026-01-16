using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Data.Configurations;

public class SliderConfiguration : IEntityTypeConfiguration<Slider>
{
    public void Configure(EntityTypeBuilder<Slider> builder)
    {
        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.ShortDescription)
            .HasMaxLength(500);

        builder.Property(t => t.Image)
            .HasMaxLength(500);

        builder.Property(t => t.BgColor)
            .HasMaxLength(20);

        builder.Property(t => t.IsEnabled)
            .IsRequired()
            .HasDefaultValue(false);

        builder.HasOne(s => s.Car)
            .WithMany()
            .HasForeignKey(s => s.CarId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}