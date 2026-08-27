using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Branches.DTOs;
namespace Workora.Application.Features.Branches.Commands.DeleteBranch;

/// <summary>
/// Command to delete a branch.
/// </summary>
public record DeleteBranchCommand(int Id) : IRequest<ApiResponse<bool>>;
