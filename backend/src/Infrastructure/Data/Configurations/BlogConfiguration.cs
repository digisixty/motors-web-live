using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Data.Configurations;

public class BlogConfiguration : IEntityTypeConfiguration<Blog>
{
    public void Configure(EntityTypeBuilder<Blog> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Slug)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.ShortDescription)
            .HasMaxLength(500);

        builder.Property(x => x.FullDescription)
            .HasMaxLength(5000);

        builder.Property(x => x.CoverImage)
            .HasMaxLength(500);

        builder.Property(x => x.MetaTags)
            .HasMaxLength(1000);

        // Configure JSON columns for list properties
        builder.Property(x => x.ImagesGallery)
            .HasColumnType("jsonb");

        builder.Property(x => x.VideosGallery)
            .HasColumnType("jsonb");

        // Create unique index on Slug to ensure unique URLs
        builder.HasIndex(x => x.Slug)
            .IsUnique();
    }
}