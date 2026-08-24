using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Branch"/> entity.
/// </summary>
public class BranchConfiguration : IEntityTypeConfiguration<Branch>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Branch> builder)
    {
        builder.ToTable("branches");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.Location)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Address).HasMaxLength(500);
        builder.Property(x => x.Timezone).HasMaxLength(100).HasDefaultValue("UTC");

        builder.HasIndex(x => new { x.CompanyId, x.Code }).IsUnique();

        builder.HasOne(x => x.Company)
            .WithMany(x => x.Branches)
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
