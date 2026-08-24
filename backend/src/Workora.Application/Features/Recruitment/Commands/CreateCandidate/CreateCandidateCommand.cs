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
/// Command to submit a candidate application for an open job vacancy.
/// </summary>
public record CreateCandidateCommand(
    int JobPostingId,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? ResumeUrl) : IRequest<ApiResponse<CandidateDto>>;

/// <summary>
/// Validator for <see cref="CreateCandidateCommand"/>.
/// </summary>
public class CreateCandidateCommandValidator : AbstractValidator<CreateCandidateCommand>
{
    /// <summary>
    /// Initializes validation rules for candidate applications.
    /// </summary>
    public CreateCandidateCommandValidator()
    {
        RuleFor(x => x.JobPostingId).GreaterThan(0).WithMessage("Valid job posting ID is required.");
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100).WithMessage("First name is required.");
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100).WithMessage("Last name is required.");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Valid email is required.");
    }
}

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
