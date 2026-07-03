using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="LoginAuditLog"/> entity.
/// </summary>
public class LoginAuditLogConfiguration : IEntityTypeConfiguration<LoginAuditLog>
{
    /// <summary>
    /// Configures the entity properties and relationships.
    /// </summary>
    /// <param name="builder">The builder to be used to configure the entity type.</param>
    public void Configure(EntityTypeBuilder<LoginAuditLog> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.Email);
    }
}
