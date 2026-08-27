using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="OvertimeRequest"/> entity.
/// </summary>
public class OvertimeRequestConfiguration : IEntityTypeConfiguration<OvertimeRequest>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<OvertimeRequest> builder)
    {
        builder.ToTable("overtime_requests");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.EmployeeId).IsRequired();
        builder.Property(e => e.OvertimeDate).IsRequired();
        builder.Property(e => e.StartTime).IsRequired();
        builder.Property(e => e.EndTime).IsRequired();
        builder.Property(e => e.HoursRequested).HasColumnType("decimal(5,2)").IsRequired();
        builder.Property(e => e.Reason).HasMaxLength(500).IsRequired();
        builder.Property(e => e.Status).IsRequired();
        builder.Property(e => e.PayrollRunId);

        builder.HasOne(e => e.Employee)
            .WithMany()
            .HasForeignKey(e => e.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => new { e.EmployeeId, e.OvertimeDate });
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.OvertimeDate);

        builder.HasQueryFilter(e => !e.IsDeleted);
    }
}