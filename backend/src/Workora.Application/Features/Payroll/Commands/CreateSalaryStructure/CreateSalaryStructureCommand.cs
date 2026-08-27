using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.CreateSalaryStructure;

/// <summary>
/// Command to create a salary structure with itemized components.
/// </summary>
public record CreateSalaryStructureCommand(
    int CompanyId,
    string Name,
    string? Description,
    IReadOnlyList<CreateSalaryComponentDto> Components) : IRequest<ApiResponse<SalaryStructureDto>>;
