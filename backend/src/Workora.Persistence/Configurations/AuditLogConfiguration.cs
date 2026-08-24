using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="AuditLog"/> entity.
/// </summary>
public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Action).IsRequired().HasMaxLength(100);
        builder.Property(x => x.EntityName).IsRequired().HasMaxLength(100);
        builder.Property(x => x.EntityId).HasMaxLength(100);
        builder.Property(x => x.ActorEmail).HasMaxLength(255);
        builder.Property(x => x.IpAddress).HasMaxLength(50);
        builder.Property(x => x.UserAgent).HasMaxLength(500);

        builder.HasIndex(x => x.Timestamp);
        builder.HasIndex(x => x.EntityName);
        builder.HasIndex(x => x.UserId);
    }
}
