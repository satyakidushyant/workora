using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="JobPosting"/> entity.
/// </summary>
public class JobPostingConfiguration : IEntityTypeConfiguration<JobPosting>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<JobPosting> builder)
    {
        builder.ToTable("job_postings");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Location).IsRequired().HasMaxLength(150);
        builder.Property(x => x.SalaryMin).HasPrecision(18, 2);
        builder.Property(x => x.SalaryMax).HasPrecision(18, 2);

        builder.HasOne(x => x.Department)
            .WithMany()
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Candidates)
            .WithOne(x => x.JobPosting)
            .HasForeignKey(x => x.JobPostingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
