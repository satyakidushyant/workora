using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="EmployeeBankDetail"/> entity.
/// </summary>
public class EmployeeBankDetailConfiguration : IEntityTypeConfiguration<EmployeeBankDetail>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<EmployeeBankDetail> builder)
    {
        builder.ToTable("employee_bank_details");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.BankName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.AccountNumber)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.AccountHolderName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.BranchCode).HasMaxLength(50);
        builder.Property(x => x.SwiftCode).HasMaxLength(50);

        builder.HasOne(x => x.Employee)
            .WithMany(x => x.BankDetails)
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
