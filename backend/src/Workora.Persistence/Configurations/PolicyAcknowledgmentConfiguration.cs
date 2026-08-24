using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="PolicyAcknowledgment"/> entity.
/// </summary>
public class PolicyAcknowledgmentConfiguration : IEntityTypeConfiguration<PolicyAcknowledgment>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<PolicyAcknowledgment> builder)
    {
        builder.ToTable("policy_acknowledgments");
        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.PolicyId, x.EmployeeId }).IsUnique();

        builder.HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
