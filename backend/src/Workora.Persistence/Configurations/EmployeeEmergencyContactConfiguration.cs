using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="EmployeeEmergencyContact"/> entity.
/// </summary>
public class EmployeeEmergencyContactConfiguration : IEntityTypeConfiguration<EmployeeEmergencyContact>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<EmployeeEmergencyContact> builder)
    {
        builder.ToTable("employee_emergency_contacts");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.Relationship)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.PhoneNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.AlternativePhoneNumber).HasMaxLength(50);

        builder.HasOne(x => x.Employee)
            .WithMany(x => x.EmergencyContacts)
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
