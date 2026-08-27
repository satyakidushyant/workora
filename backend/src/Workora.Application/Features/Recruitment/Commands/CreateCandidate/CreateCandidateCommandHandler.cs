using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.CreateCandidate;

/// <summary>
/// Handler for <see cref="CreateCandidateCommand"/>.
/// </summary>
public class CreateCandidateCommandHandler : IRequestHandler<CreateCandidateCommand, ApiResponse<CandidateDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateCandidateCommandHandler"/> class.
    /// </summary>
    public CreateCandidateCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<CandidateDto>> Handle(CreateCandidateCommand request, CancellationToken ct)
    {
        var job = await _recruitmentRepository.GetByIdAsync(request.JobPostingId, ct);
        if (job == null)
        {
            return ApiResponse<CandidateDto>.Fail(ResponseMessage.JobPostingNotFound.GetDescription());
        }

        EmailAddress emailObj;
        try
        {
            emailObj = EmailAddress.Create(request.Email);
        }
        catch (ArgumentException ex)
        {
            return ApiResponse<CandidateDto>.Fail(ex.Message);
        }

        var candidate = Candidate.Create(
            request.JobPostingId,
            request.FirstName,
            request.LastName,
            emailObj,
            request.Phone,
            request.ResumeUrl);

        await _recruitmentRepository.AddCandidateAsync(candidate, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var loaded = await _recruitmentRepository.GetCandidateByIdAsync(candidate.Id, ct);
        var dto = _mapper.Map<CandidateDto>(loaded ?? candidate);
        return ApiResponse<CandidateDto>.Success(dto, ResponseMessage.CandidateCreated.GetDescription());
    }
}
