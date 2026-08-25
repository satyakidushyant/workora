using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for <see cref="FieldVisit"/>.
/// </summary>
public class FieldVisitConfiguration : IEntityTypeConfiguration<FieldVisit>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<FieldVisit> builder)
    {
        builder.ToTable("field_visits");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ClientName).HasMaxLength(150);
        builder.Property(x => x.VisitPurpose).HasMaxLength(250);
        builder.Property(x => x.CheckInAddress).HasMaxLength(300);
        builder.Property(x => x.CheckInLatitude).HasPrecision(10, 8);
        builder.Property(x => x.CheckInLongitude).HasPrecision(11, 8);
        builder.Property(x => x.CheckOutLatitude).HasPrecision(10, 8);
        builder.Property(x => x.CheckOutLongitude).HasPrecision(11, 8);
        builder.Property(x => x.DistanceTraveledKm).HasPrecision(6, 2);
        builder.Property(x => x.MeetingNotes).HasMaxLength(1000);
        builder.Property(x => x.SignatureUrl).HasMaxLength(500);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
