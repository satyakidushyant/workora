using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="EmployeeSalaryAssignment"/> entity.
/// </summary>
public class EmployeeSalaryAssignmentConfiguration : IEntityTypeConfiguration<EmployeeSalaryAssignment>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<EmployeeSalaryAssignment> builder)
    {
        builder.ToTable("employee_salary_assignments");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.BaseSalary).HasPrecision(18, 2);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.SalaryStructure)
            .WithMany()
            .HasForeignKey(x => x.SalaryStructureId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
