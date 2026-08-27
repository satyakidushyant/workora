using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.UpdateMyEmployeeProfile;

/// <summary>
/// Command for an authenticated employee to update their own profile contact details.
/// </summary>
public record UpdateMyEmployeeProfileCommand(
    string? Phone,
    string? Address) : IRequest<ApiResponse<EmployeeDetailDto>>;
