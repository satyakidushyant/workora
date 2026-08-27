using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.SuperAdmin.DTOs;
namespace Workora.Application.Features.SuperAdmin.Commands.ReactivateOrganization;

/// <summary>
/// Command to reactivate a suspended tenant organization.
/// </summary>
public record ReactivateOrganizationCommand(int Id) : IRequest<ApiResponse<bool>>;
