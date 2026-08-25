using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for <see cref="ExpenseClaim"/>.
/// </summary>
public class ExpenseClaimConfiguration : IEntityTypeConfiguration<ExpenseClaim>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<ExpenseClaim> builder)
    {
        builder.ToTable("expense_claims");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Amount).HasPrecision(10, 2);
        builder.Property(x => x.MerchantName).HasMaxLength(150);
        builder.Property(x => x.Description).HasMaxLength(500);
        builder.Property(x => x.ReceiptUrl).HasMaxLength(500);
        builder.Property(x => x.RejectionReason).HasMaxLength(500);

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
