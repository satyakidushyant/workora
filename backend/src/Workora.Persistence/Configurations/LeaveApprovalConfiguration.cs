using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="LeaveApproval"/> entity.
/// </summary>
public class LeaveApprovalConfiguration : IEntityTypeConfiguration<LeaveApproval>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<LeaveApproval> builder)
    {
        builder.ToTable("leave_approvals");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ApproverRole).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Status).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Comments).HasMaxLength(500);

        builder.HasOne(x => x.LeaveRequest)
            .WithMany(x => x.Approvals)
            .HasForeignKey(x => x.LeaveRequestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
