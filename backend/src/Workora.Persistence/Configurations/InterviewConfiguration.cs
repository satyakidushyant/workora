using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Interview"/> entity.
/// </summary>
public class InterviewConfiguration : IEntityTypeConfiguration<Interview>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Interview> builder)
    {
        builder.ToTable("interviews");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.LocationOrLink).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Feedback).HasMaxLength(2000);

        builder.HasOne(x => x.Candidate)
            .WithMany(x => x.Interviews)
            .HasForeignKey(x => x.CandidateId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Interviewer)
            .WithMany()
            .HasForeignKey(x => x.InterviewerEmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
