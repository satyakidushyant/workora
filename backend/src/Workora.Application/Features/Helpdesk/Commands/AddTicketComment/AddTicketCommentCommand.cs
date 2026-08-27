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
