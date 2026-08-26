using System;
using System.Collections.Generic;

namespace Workora.Application.Features.Authentication.DTOs;

/// <summary>
/// Data transfer object for the current authenticated user's profile and RBAC/PBAC context.
/// </summary>
/// <param name="Id">The globally unique identifier (UUID) of the user.</param>
/// <param name="Email">The user's corporate email address.</param>
/// <param name="FirstName">The user's first name.</param>
/// <param name="LastName">The user's last name.</param>
/// <param name="EmployeeId">The internal employee database identifier, if linked.</param>
/// <param name="Roles">The assigned system/security role names.</param>
/// <param name="Permissions">The discrete permission policy identifiers.</param>
/// <param name="UserId">The internal integer user account ID.</param>
/// <param name="TenantId">The tenant organization UUID context.</param>
/// <param name="CompanyId">The company ID the user or employee belongs to.</param>
/// <param name="CompanyName">The company name.</param>
/// <param name="CompanyCode">The short company code identifier.</param>
/// <param name="EmployeeCode">The employee alphanumeric code (e.g. EMP-2026-0001).</param>
/// <param name="DepartmentName">The department name of the employee.</param>
/// <param name="DesignationTitle">The designation/job title of the employee.</param>
public record UserProfileDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    int? EmployeeId,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions,
    int? UserId = null,
    Guid? TenantId = null,
    int? CompanyId = null,
    string? CompanyName = null,
    string? CompanyCode = null,
    string? EmployeeCode = null,
    string? DepartmentName = null,
    string? DesignationTitle = null
);
