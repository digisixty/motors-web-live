using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;
using MyApp.Domain.Enums;

namespace MyApp.Infrastructure.Data.Configurations;

public class ContactSubmissionConfiguration : IEntityTypeConfiguration<ContactSubmission>
{
    public void Configure(EntityTypeBuilder<ContactSubmission> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FullName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.Message)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(x => x.Type)
            .IsRequired()
            .HasDefaultValue(ContactSubmissionType.Message)
            .HasConversion<int>();

        builder.Property(x => x.ExtraDetails)
            .HasMaxLength(1000);

  
        builder.Property(x => x.ProcessedBy)
            .HasMaxLength(255);

        // Create index for processed status to optimize admin queries
        builder.HasIndex(x => x.IsProcessed);
        
        // Create index for created date to optimize sorting
        builder.HasIndex(x => x.Created);
    }
}