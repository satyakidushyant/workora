using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.FinalizeAppraisal;

/// <summary>
/// Command to finalize an appraisal review cycle with composite score.
/// </summary>
public record FinalizeAppraisalCommand(
    int Id,
    decimal FinalScore) : IRequest<ApiResponse<AppraisalDto>>;
