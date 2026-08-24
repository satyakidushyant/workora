using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="PayrollRun"/> entity.
/// </summary>
public class PayrollRunConfiguration : IEntityTypeConfiguration<PayrollRun>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<PayrollRun> builder)
    {
        builder.ToTable("payroll_runs");
        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.CompanyId, x.PeriodMonth, x.PeriodYear }).IsUnique();

        builder.Property(x => x.TotalGrossPay).HasPrecision(18, 2);
        builder.Property(x => x.TotalDeductions).HasPrecision(18, 2);
        builder.Property(x => x.TotalNetPay).HasPrecision(18, 2);

        builder.HasMany(x => x.Payslips)
            .WithOne(x => x.PayrollRun)
            .HasForeignKey(x => x.PayrollRunId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
