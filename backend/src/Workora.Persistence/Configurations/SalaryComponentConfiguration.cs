using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="SalaryComponent"/> entity.
/// </summary>
public class SalaryComponentConfiguration : IEntityTypeConfiguration<SalaryComponent>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<SalaryComponent> builder)
    {
        builder.ToTable("salary_components");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(150);
        builder.Property(x => x.Code).IsRequired().HasMaxLength(50);
        builder.Property(x => x.DefaultValue).HasPrecision(18, 2);

        builder.HasOne(x => x.SalaryStructure)
            .WithMany(x => x.Components)
            .HasForeignKey(x => x.SalaryStructureId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
