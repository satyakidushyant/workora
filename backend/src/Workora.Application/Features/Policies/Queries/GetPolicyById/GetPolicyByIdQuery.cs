using AutoMapper;
using MediatR;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Queries.GetPolicyById;

/// <summary>
/// Query to retrieve details of a specific company policy.
/// </summary>
public record GetPolicyByIdQuery(int Id) : IRequest<ApiResponse<PolicyDto>>;
