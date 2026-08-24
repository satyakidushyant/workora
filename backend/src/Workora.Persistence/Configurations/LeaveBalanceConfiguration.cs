using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="LeaveBalance"/> entity.
/// </summary>
public class LeaveBalanceConfiguration : IEntityTypeConfiguration<LeaveBalance>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<LeaveBalance> builder)
    {
        builder.ToTable("leave_balances");
        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.EmployeeId, x.LeaveTypeId, x.Year }).IsUnique();

        builder.Property(x => x.AllocatedDays).HasPrecision(5, 2);
        builder.Property(x => x.UsedDays).HasPrecision(5, 2);
        builder.Property(x => x.PendingDays).HasPrecision(5, 2);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.LeaveType)
            .WithMany()
            .HasForeignKey(x => x.LeaveTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
