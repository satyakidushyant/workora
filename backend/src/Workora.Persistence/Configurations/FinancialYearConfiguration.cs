using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="FinancialYear"/> entity.
/// </summary>
public class FinancialYearConfiguration : IEntityTypeConfiguration<FinancialYear>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<FinancialYear> builder)
    {
        builder.ToTable("financial_years");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Name).HasMaxLength(50).IsRequired();
        builder.Property(e => e.StartDate).IsRequired();
        builder.Property(e => e.EndDate).IsRequired();
        builder.Property(e => e.IsCurrent).IsRequired();
        builder.Property(e => e.IsClosed).IsRequired();
        builder.HasQueryFilter(e => !e.IsDeleted);
    }
}