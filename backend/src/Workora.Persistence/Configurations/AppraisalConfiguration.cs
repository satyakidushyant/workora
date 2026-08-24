using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Appraisal"/> entity.
/// </summary>
public class AppraisalConfiguration : IEntityTypeConfiguration<Appraisal>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Appraisal> builder)
    {
        builder.ToTable("appraisals");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Period).IsRequired().HasMaxLength(100);
        builder.Property(x => x.SelfReviewComments).HasMaxLength(2000);
        builder.Property(x => x.ManagerReviewComments).HasMaxLength(2000);
        builder.Property(x => x.FinalScore).HasPrecision(3, 2);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Reviewer)
            .WithMany()
            .HasForeignKey(x => x.ReviewerEmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
