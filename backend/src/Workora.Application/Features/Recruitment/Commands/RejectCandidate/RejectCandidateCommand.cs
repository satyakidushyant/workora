using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.RejectCandidate;

/// <summary>
/// Command to reject a candidate application.
/// </summary>
public record RejectCandidateCommand(
    int Id,
    string? Reason) : IRequest<ApiResponse<CandidateDto>>;

/// <summary>
/// Handler for <see cref="RejectCandidateCommand"/>.
/// </summary>
public class RejectCandidateCommandHandler : IRequestHandler<RejectCandidateCommand, ApiResponse<CandidateDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="RejectCandidateCommandHandler"/> class.
    /// </summary>
    public RejectCandidateCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<CandidateDto>> Handle(RejectCandidateCommand request, CancellationToken ct)
    {
        var candidate = await _recruitmentRepository.GetCandidateByIdAsync(request.Id, ct);
        if (candidate == null)
        {
            return ApiResponse<CandidateDto>.Fail(ResponseMessage.CandidateNotFound.GetDescription());
        }

        candidate.Reject(request.Reason);
        _recruitmentRepository.UpdateCandidate(candidate);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<CandidateDto>(candidate);
        return ApiResponse<CandidateDto>.Success(dto, ResponseMessage.CandidateRejected.GetDescription());
    }
}
