using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="PayslipItem"/> entity.
/// </summary>
public class PayslipItemConfiguration : IEntityTypeConfiguration<PayslipItem>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<PayslipItem> builder)
    {
        builder.ToTable("payslip_items");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ComponentName).IsRequired().HasMaxLength(150);
        builder.Property(x => x.ComponentCode).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Amount).HasPrecision(18, 2);

        builder.HasOne(x => x.Payslip)
            .WithMany(x => x.Items)
            .HasForeignKey(x => x.PayslipId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
