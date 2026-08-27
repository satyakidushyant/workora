using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Compliance.Queries.GenerateForm16;

/// <summary>
/// Query to generate Form 16 Part A/B PDF file for an employee.
/// </summary>
public record GenerateForm16Query(int EmployeeId, string FinancialYear) : IRequest<ApiResponse<StatutoryExportFileDto>>;
