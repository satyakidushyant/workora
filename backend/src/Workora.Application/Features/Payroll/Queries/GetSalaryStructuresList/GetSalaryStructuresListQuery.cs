using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetSalaryStructuresList;

/// <summary>
/// Query to retrieve all salary structures for a company.
/// </summary>
public record GetSalaryStructuresListQuery(int CompanyId) : IRequest<ApiResponse<IReadOnlyList<SalaryStructureDto>>>;
