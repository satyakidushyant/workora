using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;
using Workora.Domain.ValueObjects;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Candidate"/> entity.
/// </summary>
public class CandidateConfiguration : IEntityTypeConfiguration<Candidate>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Candidate> builder)
    {
        builder.ToTable("candidates");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(x => x.LastName).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Phone).HasMaxLength(50);
        builder.Property(x => x.ResumeUrl).HasMaxLength(500);
        builder.Property(x => x.RejectionReason).HasMaxLength(500);

        builder.Property(x => x.Email)
            .HasConversion(
                v => v.Value,
                v => EmailAddress.Create(v))
            .IsRequired()
            .HasMaxLength(255);

        builder.HasOne(x => x.JobPosting)
            .WithMany(x => x.Candidates)
            .HasForeignKey(x => x.JobPostingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Interviews)
            .WithOne(x => x.Candidate)
            .HasForeignKey(x => x.CandidateId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Offers)
            .WithOne(x => x.Candidate)
            .HasForeignKey(x => x.CandidateId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
