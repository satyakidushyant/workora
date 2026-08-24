using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Policy"/> entity.
/// </summary>
public class PolicyConfiguration : IEntityTypeConfiguration<Policy>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Policy> builder)
    {
        builder.ToTable("policies");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Version).IsRequired().HasMaxLength(50);

        builder.HasMany(x => x.Acknowledgments)
            .WithOne(x => x.Policy)
            .HasForeignKey(x => x.PolicyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
