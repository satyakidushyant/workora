using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.AcceptJobOffer;

/// <summary>
/// Command to register a candidate's acceptance of an employment offer.
/// </summary>
public record AcceptJobOfferCommand(int Id) : IRequest<ApiResponse<JobOfferDto>>;
