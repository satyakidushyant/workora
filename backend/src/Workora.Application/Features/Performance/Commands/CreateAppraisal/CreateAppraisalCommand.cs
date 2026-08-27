using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.CreateAppraisal;

/// <summary>
/// Command to initiate an appraisal review cycle for an employee.
/// </summary>
public record CreateAppraisalCommand(
    int EmployeeId,
    int ReviewerEmployeeId,
    string Period,
    int Year) : IRequest<ApiResponse<AppraisalDto>>;
