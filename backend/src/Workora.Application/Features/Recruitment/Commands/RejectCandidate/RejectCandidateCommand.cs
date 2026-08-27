using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.RejectCandidate;

/// <summary>
/// Command to reject a candidate application.
/// </summary>
public record RejectCandidateCommand(
    int Id,
    string? Reason) : IRequest<ApiResponse<CandidateDto>>;
