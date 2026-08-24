using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for the <see cref="JobOffer"/> entity.
/// </summary>
public class JobOfferConfiguration : IEntityTypeConfiguration<JobOffer>
{
    /// <summary>
    /// Configures the entity properties, constraints, and relationships.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<JobOffer> builder)
    {
        builder.ToTable("job_offers");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.OfferedSalary).HasPrecision(18, 2);
        builder.Property(x => x.Notes).HasMaxLength(1000);

        builder.HasOne(x => x.Candidate)
            .WithMany(x => x.Offers)
            .HasForeignKey(x => x.CandidateId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
