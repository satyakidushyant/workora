using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="AttendanceCorrection"/> entity.
/// </summary>
public class AttendanceCorrectionConfiguration : IEntityTypeConfiguration<AttendanceCorrection>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<AttendanceCorrection> builder)
    {
        builder.ToTable("attendance_corrections");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Reason).IsRequired().HasMaxLength(500);
        builder.Property(x => x.ApproverRemarks).HasMaxLength(500);

        builder.HasOne(x => x.AttendanceRecord)
            .WithMany(x => x.Corrections)
            .HasForeignKey(x => x.AttendanceRecordId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
