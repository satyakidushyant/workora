using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="TrainingEnrollment"/> entity.
/// </summary>
public class TrainingEnrollmentConfiguration : IEntityTypeConfiguration<TrainingEnrollment>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<TrainingEnrollment> builder)
    {
        builder.ToTable("training_enrollments");
        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.TrainingProgramId, x.EmployeeId }).IsUnique();

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
