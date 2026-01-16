using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Data.Configurations;

public class NewsletterSubscriptionConfiguration : IEntityTypeConfiguration<NewsletterSubscription>
{
    public void Configure(EntityTypeBuilder<NewsletterSubscription> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Create unique index on email to prevent duplicates
        builder.HasIndex(x => x.Email)
            .IsUnique();

        // Create index for active status to optimize queries
        builder.HasIndex(x => x.IsActive);

        // Create index for created date to optimize sorting
        builder.HasIndex(x => x.Created);
    }
}
