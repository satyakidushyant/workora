using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="EmployeeOnboarding"/> entity.
/// </summary>
public class EmployeeOnboardingConfiguration : IEntityTypeConfiguration<EmployeeOnboarding>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<EmployeeOnboarding> builder)
    {
        builder.ToTable("employee_onboardings");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.EmployeeId).IsRequired();
        builder.Property(e => e.ChecklistId).IsRequired();
        builder.Property(e => e.IsCompleted).IsRequired();
        builder.Property(e => e.VerifiedAt);

        builder.HasOne(e => e.Employee)
            .WithMany()
            .HasForeignKey(e => e.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Checklist)
            .WithMany()
            .HasForeignKey(e => e.ChecklistId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.VerifiedByEmployee)
            .WithMany()
            .HasForeignKey(e => e.VerifiedByEmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => new { e.EmployeeId, e.ChecklistId }).IsUnique();
        builder.HasQueryFilter(e => !e.IsDeleted);
    }
}