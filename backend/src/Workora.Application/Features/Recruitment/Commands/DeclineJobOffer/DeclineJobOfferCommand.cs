using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.DeclineJobOffer;

/// <summary>
/// Command to register a candidate's refusal of an employment offer.
/// </summary>
public record DeclineJobOfferCommand(int Id) : IRequest<ApiResponse<JobOfferDto>>;
