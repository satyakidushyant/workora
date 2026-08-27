using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.CreatePayhead;

/// <summary>
/// Command to create a salary payhead.
/// </summary>
public record CreatePayheadCommand(
    int SalaryStructureId,
    string Name,
    string Code,
    ComponentType Type,
    CalculationType CalculationType,
    decimal DefaultValue,
    bool IsTaxable = true) : IRequest<ApiResponse<PayheadDto>>;
