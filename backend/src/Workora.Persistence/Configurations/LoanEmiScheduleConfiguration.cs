using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for <see cref="LoanEmiSchedule"/>.
/// </summary>
public class LoanEmiScheduleConfiguration : IEntityTypeConfiguration<LoanEmiSchedule>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<LoanEmiSchedule> builder)
    {
        builder.ToTable("loan_emi_schedules");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.EmiAmount).HasPrecision(10, 2);
        builder.Property(x => x.PrincipalComponent).HasPrecision(10, 2);
        builder.Property(x => x.InterestComponent).HasPrecision(10, 2);

        builder.HasOne(x => x.LoanRecord)
            .WithMany(x => x.EmiSchedules)
            .HasForeignKey(x => x.LoanRecordId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
