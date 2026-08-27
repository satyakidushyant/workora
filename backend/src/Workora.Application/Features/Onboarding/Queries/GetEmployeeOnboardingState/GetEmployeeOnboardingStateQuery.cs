using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Queries.GetEmployeeOnboardingState;

/// <summary>
/// Query to retrieve the onboarding state for a specific employee.
/// </summary>
public record GetEmployeeOnboardingStateQuery(int EmployeeId) : IRequest<ApiResponse<EmployeeOnboardingStateDto>>;
