using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="LeaveRequest"/> entity.
/// </summary>
public class LeaveRequestConfiguration : IEntityTypeConfiguration<LeaveRequest>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<LeaveRequest> builder)
    {
        builder.ToTable("leave_requests");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.DaysCount).HasPrecision(5, 2);
        builder.Property(x => x.Reason).IsRequired().HasMaxLength(500);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.LeaveType)
            .WithMany()
            .HasForeignKey(x => x.LeaveTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Approvals)
            .WithOne(x => x.LeaveRequest)
            .HasForeignKey(x => x.LeaveRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
