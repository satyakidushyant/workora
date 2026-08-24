using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="EmployeeEmploymentHistory"/> entity.
/// </summary>
public class EmployeeEmploymentHistoryConfiguration : IEntityTypeConfiguration<EmployeeEmploymentHistory>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<EmployeeEmploymentHistory> builder)
    {
        builder.ToTable("employee_employment_history");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.EventType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Notes).HasMaxLength(1000);

        builder.HasOne(x => x.Employee)
            .WithMany(x => x.EmploymentHistory)
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
