using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for <see cref="LoanRecord"/>.
/// </summary>
public class LoanRecordConfiguration : IEntityTypeConfiguration<LoanRecord>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<LoanRecord> builder)
    {
        builder.ToTable("loan_records");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.PrincipalAmount).HasPrecision(12, 2);
        builder.Property(x => x.MonthlyEmi).HasPrecision(10, 2);
        builder.Property(x => x.TotalRepaid).HasPrecision(12, 2);
        builder.Property(x => x.RemainingBalance).HasPrecision(12, 2);
        builder.Property(x => x.Reason).HasMaxLength(500);
        builder.Property(x => x.RejectionReason).HasMaxLength(500);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.EmiSchedules)
            .WithOne(x => x.LoanRecord)
            .HasForeignKey(x => x.LoanRecordId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
