using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.UpsertBankDetails;

/// <summary>
/// Command to create or update an employee's bank disbursement details.
/// </summary>
public record UpsertBankDetailsCommand(
    int EmployeeId,
    int? Id,
    string BankName,
    string AccountNumber,
    string AccountHolderName,
    string? BranchCode,
    string? SwiftCode,
    bool IsPrimary) : IRequest<ApiResponse<bool>>;
