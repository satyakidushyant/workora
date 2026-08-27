using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.UpsertEmergencyContact;

/// <summary>
/// Command to add or update an emergency contact for an employee.
/// </summary>
public record UpsertEmergencyContactCommand(
    int EmployeeId,
    int? Id,
    string Name,
    string Relationship,
    string PhoneNumber,
    string? AlternativePhoneNumber,
    bool IsPrimary) : IRequest<ApiResponse<bool>>;
