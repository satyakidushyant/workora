using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.UpdateSalaryStructure;

/// <summary>
/// Command to update an existing salary structure.
/// </summary>
public record UpdateSalaryStructureCommand(
    int Id,
    string Name,
    string? Description,
    IReadOnlyList<CreateSalaryComponentDto> Components) : IRequest<ApiResponse<SalaryStructureDto>>;
