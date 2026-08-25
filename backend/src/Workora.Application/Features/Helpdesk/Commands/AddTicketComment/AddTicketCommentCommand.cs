using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Commands.AddTicketComment;

/// <summary>
/// Command to post a comment/reply to a ticket thread.
/// </summary>
public record AddTicketCommentCommand(
    int TicketId,
    int UserId,
    string CommentText,
    string? AttachmentUrl,
    bool IsInternalOnly) : IRequest<ApiResponse<TicketCommentDto>>;

/// <summary>
/// Validator for <see cref="AddTicketCommentCommand"/>.
/// </summary>
public class AddTicketCommentCommandValidator : AbstractValidator<AddTicketCommentCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public AddTicketCommentCommandValidator()
    {
        RuleFor(x => x.TicketId).GreaterThan(0).WithMessage("Valid ticket ID is required.");
        RuleFor(x => x.CommentText).NotEmpty().MaximumLength(2000).WithMessage("Comment text is required.");
    }
}

/// <summary>
/// Handler for <see cref="AddTicketCommentCommand"/>.
/// </summary>
public class AddTicketCommentCommandHandler : IRequestHandler<AddTicketCommentCommand, ApiResponse<TicketCommentDto>>
{
    private readonly IHelpdeskTicketRepository _ticketRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public AddTicketCommentCommandHandler(
        IHelpdeskTicketRepository ticketRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TicketCommentDto>> Handle(AddTicketCommentCommand request, CancellationToken ct)
    {
        var ticket = await _ticketRepository.GetByIdAsync(request.TicketId, ct);
        if (ticket == null)
        {
            return ApiResponse<TicketCommentDto>.Fail("Ticket not found.");
        }

        var comment = HelpdeskTicketComment.Create(
            request.TicketId,
            request.UserId,
            request.CommentText,
            request.AttachmentUrl,
            request.IsInternalOnly);

        await _ticketRepository.AddCommentAsync(comment, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var user = await _userRepository.GetByIdAsync(request.UserId, ct);
        var dto = new TicketCommentDto(
            comment.Id,
            comment.Uuid,
            comment.TicketId,
            comment.UserId,
            user != null ? $"{user.FirstName} {user.LastName}".Trim() : null,
            comment.CommentText,
            comment.AttachmentUrl,
            comment.IsInternalOnly,
            comment.CreatedAt);

        return ApiResponse<TicketCommentDto>.Success(dto, "Comment posted.");
    }
}
