using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for <see cref="FieldGpsPing"/>.
/// </summary>
public class FieldGpsPingConfiguration : IEntityTypeConfiguration<FieldGpsPing>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<FieldGpsPing> builder)
    {
        builder.ToTable("field_gps_pings");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Latitude).HasPrecision(10, 8);
        builder.Property(x => x.Longitude).HasPrecision(11, 8);
        builder.Property(x => x.AccuracyMeters).HasPrecision(6, 2);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
