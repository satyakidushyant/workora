using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.UpdatePayhead;

/// <summary>
/// Command to update an existing salary payhead / component.
/// </summary>
public record UpdatePayheadCommand(
    int Id,
    string Name,
    string Code,
    ComponentType Type,
    CalculationType CalculationType,
    decimal DefaultValue,
    bool IsTaxable = true) : IRequest<ApiResponse<PayheadDto>>;
