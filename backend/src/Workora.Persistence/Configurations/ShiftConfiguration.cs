using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Shift"/> entity.
/// </summary>
public class ShiftConfiguration : IEntityTypeConfiguration<Shift>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Shift> builder)
    {
        builder.ToTable("shifts");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Code).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Description).HasMaxLength(500);

        builder.HasIndex(x => new { x.CompanyId, x.Code }).IsUnique();

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
