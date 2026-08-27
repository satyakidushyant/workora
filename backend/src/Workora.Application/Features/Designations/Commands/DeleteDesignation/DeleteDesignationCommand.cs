using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Designations.DTOs;
namespace Workora.Application.Features.Designations.Commands.DeleteDesignation;

/// <summary>
/// Command to delete a designation.
/// </summary>
public record DeleteDesignationCommand(int Id) : IRequest<ApiResponse<bool>>;
