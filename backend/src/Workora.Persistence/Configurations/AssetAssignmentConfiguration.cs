using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="AssetAssignment"/> entity.
/// </summary>
public class AssetAssignmentConfiguration : IEntityTypeConfiguration<AssetAssignment>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<AssetAssignment> builder)
    {
        builder.ToTable("asset_assignments");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ReturnCondition).HasMaxLength(500);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
