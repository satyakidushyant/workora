using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.SubmitManagerReview;

/// <summary>
/// Command for a manager to submit their performance appraisal evaluation.
/// </summary>
public record SubmitManagerReviewCommand(
    int Id,
    string Comments,
    int Rating) : IRequest<ApiResponse<AppraisalDto>>;
