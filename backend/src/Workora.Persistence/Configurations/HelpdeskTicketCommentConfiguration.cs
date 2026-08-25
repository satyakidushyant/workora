using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Workora.Domain.Entities;

namespace Workora.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for <see cref="HelpdeskTicketComment"/>.
/// </summary>
public class HelpdeskTicketCommentConfiguration : IEntityTypeConfiguration<HelpdeskTicketComment>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<HelpdeskTicketComment> builder)
    {
        builder.ToTable("helpdesk_ticket_comments");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.CommentText).HasMaxLength(2000);
        builder.Property(x => x.AttachmentUrl).HasMaxLength(500);

        builder.HasOne(x => x.Ticket)
            .WithMany(x => x.Comments)
            .HasForeignKey(x => x.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
