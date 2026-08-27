using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Commands.UpdateBranch;

/// <summary>
/// Command to update an existing branch.
/// </summary>
public record UpdateBranchCommand(
    int Id,
    string Name,
    string Code,
    string Location,
    string? Address,
    string Timezone,
    bool IsHeadOffice) : IRequest<ApiResponse<BranchDto>>;
