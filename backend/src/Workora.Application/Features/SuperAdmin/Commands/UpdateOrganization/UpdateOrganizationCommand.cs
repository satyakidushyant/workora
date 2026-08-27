using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.UpdateOrganization;

/// <summary>
/// Command to update an existing organization profile from SuperAdmin.
/// </summary>
public record UpdateOrganizationCommand(
    int Id,
    string Name,
    string? RegistrationNumber = null,
    string? TaxId = null,
    string? Email = null,
    string? Phone = null,
    string? Website = null,
    int FiscalYearStartMonth = 1,
    string Currency = "USD",
    string? Address = null) : IRequest<ApiResponse<OrganizationDto>>;
