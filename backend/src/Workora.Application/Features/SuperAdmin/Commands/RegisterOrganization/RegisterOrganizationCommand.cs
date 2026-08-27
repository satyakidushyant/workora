using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.RegisterOrganization;

/// <summary>
/// Command to register a new tenant organization / company.
/// </summary>
public record RegisterOrganizationCommand(
    string Name,
    string Code,
    string? RegistrationNumber = null,
    string? TaxId = null,
    string? Email = null,
    string? Phone = null,
    string? Website = null,
    int FiscalYearStartMonth = 1,
    string Currency = "USD",
    string? Address = null) : IRequest<ApiResponse<OrganizationDto>>;
