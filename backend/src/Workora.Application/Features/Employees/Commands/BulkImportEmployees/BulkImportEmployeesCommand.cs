using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.BulkImportEmployees;

/// <summary>
/// Command to bulk upload employee records.
/// </summary>
public record BulkImportEmployeesCommand(List<BulkEmployeeItemDto> Employees) : IRequest<ApiResponse<int>>;
