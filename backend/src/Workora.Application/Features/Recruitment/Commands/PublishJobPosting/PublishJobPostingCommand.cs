using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.PublishJobPosting;

/// <summary>
/// Command to publish an active job opening.
/// </summary>
public record PublishJobPostingCommand(int Id) : IRequest<ApiResponse<JobPostingDto>>;

/// <summary>
/// Handler for <see cref="PublishJobPostingCommand"/>.
/// </summary>
public class PublishJobPostingCommandHandler : IRequestHandler<PublishJobPostingCommand, ApiResponse<JobPostingDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="PublishJobPostingCommandHandler"/> class.
    /// </summary>
    public PublishJobPostingCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<JobPostingDto>> Handle(PublishJobPostingCommand request, CancellationToken ct)
    {
        var job = await _recruitmentRepository.GetJobWithDetailsAsync(request.Id, ct);
        if (job == null)
        {
            return ApiResponse<JobPostingDto>.Fail(ResponseMessage.JobPostingNotFound.GetDescription());
        }

        job.Publish();
        _recruitmentRepository.Update(job);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<JobPostingDto>(job);
        return ApiResponse<JobPostingDto>.Success(dto, ResponseMessage.JobPostingPublished.GetDescription());
    }
}
