using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="Company"/> entity.
/// </summary>
public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.ToTable("companies");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(x => x.Code).IsUnique();

        builder.Property(x => x.RegistrationNumber).HasMaxLength(100);
        builder.Property(x => x.TaxId).HasMaxLength(100);
        builder.Property(x => x.Email).HasMaxLength(255);
        builder.Property(x => x.Phone).HasMaxLength(50);
        builder.Property(x => x.Website).HasMaxLength(255);
        builder.Property(x => x.LogoUrl).HasMaxLength(500);
        builder.Property(x => x.Currency).HasMaxLength(10).HasDefaultValue("USD");
        builder.Property(x => x.Address).HasMaxLength(500);

        builder.HasMany(x => x.Branches)
            .WithOne(x => x.Company)
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Departments)
            .WithOne(x => x.Company)
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
