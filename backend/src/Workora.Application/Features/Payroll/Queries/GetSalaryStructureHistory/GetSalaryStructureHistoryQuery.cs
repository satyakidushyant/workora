using AutoMapper;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetSalaryStructureHistory;

/// <summary>
/// Query to retrieve salary structure revision and assignment history for an employee.
/// </summary>
public record GetSalaryStructureHistoryQuery(int EmployeeId) : IRequest<ApiResponse<IReadOnlyList<EmployeeSalaryAssignmentDto>>>;
