using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetSalaryStructureById;

/// <summary>
/// Query to retrieve a specific salary structure by ID.
/// </summary>
public record GetSalaryStructureByIdQuery(int Id) : IRequest<ApiResponse<SalaryStructureDto>>;
