using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.SuperAdmin.DTOs;
namespace Workora.Application.Features.SuperAdmin.Commands.SuspendOrganization;

/// <summary>
/// Command to suspend a tenant organization.
/// </summary>
public record SuspendOrganizationCommand(int Id) : IRequest<ApiResponse<bool>>;
