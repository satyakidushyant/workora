using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Commands.UpdateCompanyProfile;

/// <summary>
/// Command to update the primary company profile.
/// </summary>
public record UpdateCompanyProfileCommand(
    int? CompanyId,
    string Name,
    string? RegistrationNumber,
    string? TaxId,
    string? Email,
    string? Phone,
    string? Website,
    int FiscalYearStartMonth,
    string Currency,
    string? Address) : IRequest<ApiResponse<CompanyDto>>;
