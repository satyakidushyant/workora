using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="TrainingProgram"/> entity.
/// </summary>
public class TrainingProgramConfiguration : IEntityTypeConfiguration<TrainingProgram>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<TrainingProgram> builder)
    {
        builder.ToTable("training_programs");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Description).IsRequired().HasMaxLength(2000);
        builder.Property(x => x.TrainerName).IsRequired().HasMaxLength(150);

        builder.HasMany(x => x.Enrollments)
            .WithOne(x => x.TrainingProgram)
            .HasForeignKey(x => x.TrainingProgramId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
