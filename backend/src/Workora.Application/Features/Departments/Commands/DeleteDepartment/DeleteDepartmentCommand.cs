using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Departments.DTOs;
namespace Workora.Application.Features.Departments.Commands.DeleteDepartment;

/// <summary>
/// Command to delete a department.
/// </summary>
public record DeleteDepartmentCommand(int Id) : IRequest<ApiResponse<bool>>;
