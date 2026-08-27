using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="OnboardingChecklist"/> entity.
/// </summary>
public class OnboardingChecklistConfiguration : IEntityTypeConfiguration<OnboardingChecklist>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<OnboardingChecklist> builder)
    {
        builder.ToTable("onboarding_checklists");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.TaskName).HasMaxLength(150).IsRequired();
        builder.Property(e => e.AssignedRole).HasMaxLength(50).IsRequired();
        builder.Property(e => e.IsMandatory).IsRequired();
        builder.HasQueryFilter(e => !e.IsDeleted);
    }
}