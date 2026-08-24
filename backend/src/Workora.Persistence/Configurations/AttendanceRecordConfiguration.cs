using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="AttendanceRecord"/> entity.
/// </summary>
public class AttendanceRecordConfiguration : IEntityTypeConfiguration<AttendanceRecord>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<AttendanceRecord> builder)
    {
        builder.ToTable("attendance_records");
        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.EmployeeId, x.AttendanceDate }).IsUnique();

        builder.Property(x => x.WorkingHours).HasPrecision(5, 2);
        builder.Property(x => x.OvertimeHours).HasPrecision(5, 2);
        builder.Property(x => x.Remarks).HasMaxLength(500);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Shift)
            .WithMany()
            .HasForeignKey(x => x.ShiftId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(x => x.Corrections)
            .WithOne(x => x.AttendanceRecord)
            .HasForeignKey(x => x.AttendanceRecordId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
