using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for <see cref="HelpdeskTicket"/>.
/// </summary>
public class HelpdeskTicketConfiguration : IEntityTypeConfiguration<HelpdeskTicket>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<HelpdeskTicket> builder)
    {
        builder.ToTable("helpdesk_tickets");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.TicketNumber).HasMaxLength(50);
        builder.HasIndex(x => x.TicketNumber).IsUnique();

        builder.Property(x => x.Subject).HasMaxLength(200);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.ResolutionNotes).HasMaxLength(2000);

        builder.HasOne(x => x.RaisedByEmployee)
            .WithMany()
            .HasForeignKey(x => x.RaisedByEmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.AssignedToEmployee)
            .WithMany()
            .HasForeignKey(x => x.AssignedToEmployeeId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(x => x.Comments)
            .WithOne(x => x.Ticket)
            .HasForeignKey(x => x.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
