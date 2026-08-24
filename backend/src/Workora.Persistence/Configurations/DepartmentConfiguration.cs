using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Department"/> entity.
/// </summary>
public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.ToTable("departments");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(x => new { x.CompanyId, x.Code }).IsUnique();

        builder.HasOne(x => x.Company)
            .WithMany(x => x.Departments)
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.ParentDepartment)
            .WithMany(x => x.SubDepartments)
            .HasForeignKey(x => x.ParentDepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Designations)
            .WithOne(x => x.Department)
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
