using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;
using Workora.Domain.ValueObjects;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Employee"/> aggregate root.
/// </summary>
public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        builder.ToTable("employees");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.EmployeeCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(x => x.EmployeeCode).IsUnique();

        builder.Property(x => x.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Email)
            .HasConversion(
                v => v.Value,
                v => EmailAddress.Create(v))
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(x => x.Email).IsUnique();

        builder.Property(x => x.Phone).HasMaxLength(50);

        builder.Property(x => x.NationalId)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(x => x.NationalId).IsUnique();

        builder.Property(x => x.TerminationReason).HasMaxLength(500);
        builder.Property(x => x.Address).HasMaxLength(500);

        builder.HasOne(x => x.Department)
            .WithMany()
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Designation)
            .WithMany()
            .HasForeignKey(x => x.DesignationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Branch)
            .WithMany()
            .HasForeignKey(x => x.BranchId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Manager)
            .WithMany(x => x.DirectReports)
            .HasForeignKey(x => x.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.User)
            .WithOne()
            .HasForeignKey<Employee>(x => x.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(x => x.EmergencyContacts)
            .WithOne(x => x.Employee)
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.BankDetails)
            .WithOne(x => x.Employee)
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.EmploymentHistory)
            .WithOne(x => x.Employee)
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
