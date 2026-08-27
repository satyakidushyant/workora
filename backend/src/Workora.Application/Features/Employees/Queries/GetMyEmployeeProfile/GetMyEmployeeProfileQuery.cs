using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetMyEmployeeProfile;

/// <summary>
/// Query to retrieve the currently logged in employee's profile.
/// </summary>
public record GetMyEmployeeProfileQuery : IRequest<ApiResponse<EmployeeDetailDto>>;
