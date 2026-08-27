using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Model for a single employee record in a bulk import request.
/// </summary>
public record BulkEmployeeItemDto(
    string EmployeeCode,
    string FirstName,
    string LastName,
    string Email,
    string NationalId,
    DateOnly DateOfBirth,
    DateOnly JoiningDate,
    Gender Gender,
    EmploymentType EmploymentType,
    int BranchId,
    int DepartmentId,
    int DesignationId,
    string? Phone = null);
