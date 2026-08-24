using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.CloseJobPosting;

/// <summary>
/// Command to close a job opening.
/// </summary>
public record CloseJobPostingCommand(int Id) : IRequest<ApiResponse<JobPostingDto>>;

/// <summary>
/// Handler for <see cref="CloseJobPostingCommand"/>.
/// </summary>
public class CloseJobPostingCommandHandler : IRequestHandler<CloseJobPostingCommand, ApiResponse<JobPostingDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CloseJobPostingCommandHandler"/> class.
    /// </summary>
    public CloseJobPostingCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<JobPostingDto>> Handle(CloseJobPostingCommand request, CancellationToken ct)
    {
        var job = await _recruitmentRepository.GetJobWithDetailsAsync(request.Id, ct);
        if (job == null)
        {
            return ApiResponse<JobPostingDto>.Fail(ResponseMessage.JobPostingNotFound.GetDescription());
        }

        job.Close();
        _recruitmentRepository.Update(job);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<JobPostingDto>(job);
        return ApiResponse<JobPostingDto>.Success(dto, ResponseMessage.JobPostingClosed.GetDescription());
    }
}
