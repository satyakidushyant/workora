using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.SubmitSelfReview;

/// <summary>
/// Command for an employee to submit their self-appraisal review.
/// </summary>
public record SubmitSelfReviewCommand(
    int Id,
    string Comments,
    int Rating) : IRequest<ApiResponse<AppraisalDto>>;
