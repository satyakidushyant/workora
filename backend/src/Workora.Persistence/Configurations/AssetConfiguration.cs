using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Asset"/> entity.
/// </summary>
public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.ToTable("assets");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(150);
        builder.Property(x => x.AssetTag).IsRequired().HasMaxLength(50);
        builder.Property(x => x.SerialNumber).HasMaxLength(100);
        builder.Property(x => x.Category).IsRequired().HasMaxLength(100);
        builder.Property(x => x.PurchaseCost).HasPrecision(18, 2);

        builder.HasIndex(x => new { x.CompanyId, x.AssetTag }).IsUnique();

        builder.HasMany(x => x.Assignments)
            .WithOne(x => x.Asset)
            .HasForeignKey(x => x.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
