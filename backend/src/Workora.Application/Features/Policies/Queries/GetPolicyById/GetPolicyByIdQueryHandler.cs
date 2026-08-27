using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Queries.GetPolicyById;

/// <summary>
/// Handler for <see cref="GetPolicyByIdQuery"/>.
/// </summary>
public class GetPolicyByIdQueryHandler : IRequestHandler<GetPolicyByIdQuery, ApiResponse<PolicyDto>>
{
    private readonly IPolicyRepository _policyRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPolicyByIdQueryHandler"/> class.
    /// </summary>
    public GetPolicyByIdQueryHandler(IPolicyRepository policyRepository, IMapper mapper)
    {
        _policyRepository = policyRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PolicyDto>> Handle(GetPolicyByIdQuery request, CancellationToken ct)
    {
        var policy = await _policyRepository.GetWithAcknowledgmentsAsync(request.Id, ct);
        if (policy == null)
        {
            return ApiResponse<PolicyDto>.Fail(ResponseMessage.PolicyNotFound.GetDescription());
        }

        var dto = _mapper.Map<PolicyDto>(policy);
        return ApiResponse<PolicyDto>.Success(dto);
    }
}
