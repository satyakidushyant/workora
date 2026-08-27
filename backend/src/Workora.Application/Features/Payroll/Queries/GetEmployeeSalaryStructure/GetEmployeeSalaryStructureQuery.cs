using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetEmployeeSalaryStructure;

/// <summary>
/// Query to retrieve an employee's assigned salary structure and base rate.
/// </summary>
public record GetEmployeeSalaryStructureQuery(int EmployeeId) : IRequest<ApiResponse<EmployeeSalaryAssignmentDto>>;
