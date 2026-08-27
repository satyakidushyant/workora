using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.SendJobOffer;

/// <summary>
/// Command to formally dispatch a job offer to a candidate.
/// </summary>
public record SendJobOfferCommand(int Id) : IRequest<ApiResponse<JobOfferDto>>;
