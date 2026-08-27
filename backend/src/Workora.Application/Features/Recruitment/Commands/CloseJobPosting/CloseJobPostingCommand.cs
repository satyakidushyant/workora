using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.CloseJobPosting;

/// <summary>
/// Command to close a job opening.
/// </summary>
public record CloseJobPostingCommand(int Id) : IRequest<ApiResponse<JobPostingDto>>;
