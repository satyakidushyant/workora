using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.MoveCandidateStage;

/// <summary>
/// Command to move a candidate across recruitment pipeline stages.
/// </summary>
public record MoveCandidateStageCommand(
    int Id,
    CandidateStage Stage) : IRequest<ApiResponse<CandidateDto>>;
