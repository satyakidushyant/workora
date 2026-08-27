using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Commands.CreateBranch;

/// <summary>
/// Command to create a new branch.
/// </summary>
public record CreateBranchCommand(
    int CompanyId,
    string Name,
    string Code,
    string Location,
    string? Address,
    string Timezone,
    bool IsHeadOffice) : IRequest<ApiResponse<BranchDto>>;
