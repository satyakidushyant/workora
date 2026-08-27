using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.PublishJobPosting;

/// <summary>
/// Command to publish an active job opening.
/// </summary>
public record PublishJobPostingCommand(int Id) : IRequest<ApiResponse<JobPostingDto>>;
