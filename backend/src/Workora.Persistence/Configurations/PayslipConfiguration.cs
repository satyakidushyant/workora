using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Payslip"/> entity.
/// </summary>
public class PayslipConfiguration : IEntityTypeConfiguration<Payslip>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Payslip> builder)
    {
        builder.ToTable("payslips");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.EmployeeCode).IsRequired().HasMaxLength(50);
        builder.Property(x => x.EmployeeName).IsRequired().HasMaxLength(200);
        builder.Property(x => x.GrossSalary).HasPrecision(18, 2);
        builder.Property(x => x.TotalDeductions).HasPrecision(18, 2);
        builder.Property(x => x.NetSalary).HasPrecision(18, 2);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Items)
            .WithOne(x => x.Payslip)
            .HasForeignKey(x => x.PayslipId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
