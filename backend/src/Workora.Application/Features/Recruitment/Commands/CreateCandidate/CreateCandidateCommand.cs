using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.CreateCandidate;

/// <summary>
/// Command to submit a candidate application for an open job vacancy.
/// </summary>
public record CreateCandidateCommand(
    int JobPostingId,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? ResumeUrl) : IRequest<ApiResponse<CandidateDto>>;
