using AutoMapper;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Commands.AssignDepartmentHead;

/// <summary>
/// Command to assign or change a department head.
/// </summary>
public record AssignDepartmentHeadCommand(int Id, int? HeadEmployeeId) : IRequest<ApiResponse<DepartmentDto>>;
