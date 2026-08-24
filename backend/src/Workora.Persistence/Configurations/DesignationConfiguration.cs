using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Designation"/> entity.
/// </summary>
public class DesignationConfiguration : IEntityTypeConfiguration<Designation>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Designation> builder)
    {
        builder.ToTable("designations");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Grade).HasMaxLength(50);
        builder.Property(x => x.Description).HasMaxLength(1000);

        builder.HasIndex(x => new { x.DepartmentId, x.Title }).IsUnique();

        builder.HasOne(x => x.Department)
            .WithMany(x => x.Designations)
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
