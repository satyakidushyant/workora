using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Policies.DTOs;
namespace Workora.Application.Features.Policies.Commands.AcknowledgePolicy;

/// <summary>
/// Command for the authenticated employee to acknowledge having read a corporate policy.
/// </summary>
public record AcknowledgePolicyCommand(int Id) : IRequest<ApiResponse<bool>>;
