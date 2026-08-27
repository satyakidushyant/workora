using AutoMapper;
using MediatR;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Queries.GetBranchById;

/// <summary>
/// Query to retrieve a branch by its ID.
/// </summary>
public record GetBranchByIdQuery(int Id) : IRequest<ApiResponse<BranchDto>>;
