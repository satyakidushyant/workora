using MediatR;
using Workora.Application.Features.Policies.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Commands.CreatePolicyVersion;

/// <summary>
/// Command to publish a new version of an existing policy.
/// </summary>
public record CreatePolicyVersionCommand(
    int PolicyId,
    string VersionNumber,
    string Content,
    string ChangeSummary) : IRequest<ApiResponse<PolicyDto>>;
