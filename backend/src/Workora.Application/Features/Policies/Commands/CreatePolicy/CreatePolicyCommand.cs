using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Commands.CreatePolicy;

/// <summary>
/// Command to create a new corporate policy document.
/// </summary>
public record CreatePolicyCommand(
    int CompanyId,
    string Title,
    string Content,
    string Version,
    DateOnly EffectiveDate,
    bool RequiresAcknowledgment = true) : IRequest<ApiResponse<PolicyDto>>;
