using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="SystemSetting"/> entity.
/// </summary>
public class SystemSettingConfiguration : IEntityTypeConfiguration<SystemSetting>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<SystemSetting> builder)
    {
        builder.ToTable("system_settings");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Key).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Value).IsRequired().HasMaxLength(2000);
        builder.Property(x => x.Description).HasMaxLength(500);
        builder.Property(x => x.Group).IsRequired().HasMaxLength(100);

        builder.HasIndex(x => new { x.CompanyId, x.Key }).IsUnique();
    }
}
