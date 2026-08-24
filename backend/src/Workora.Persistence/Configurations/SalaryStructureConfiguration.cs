using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="SalaryStructure"/> entity.
/// </summary>
public class SalaryStructureConfiguration : IEntityTypeConfiguration<SalaryStructure>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<SalaryStructure> builder)
    {
        builder.ToTable("salary_structures");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(150);
        builder.Property(x => x.Description).HasMaxLength(500);

        builder.HasMany(x => x.Components)
            .WithOne(x => x.SalaryStructure)
            .HasForeignKey(x => x.SalaryStructureId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
