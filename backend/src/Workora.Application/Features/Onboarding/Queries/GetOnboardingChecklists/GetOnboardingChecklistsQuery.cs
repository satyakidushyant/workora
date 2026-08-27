using AutoMapper;
using MediatR;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Queries.GetOnboardingChecklists;

/// <summary>
/// Query to retrieve all onboarding checklists.
/// </summary>
public record GetOnboardingChecklistsQuery() : IRequest<ApiResponse<IReadOnlyList<OnboardingChecklistDto>>>;
