using AutoMapper;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Commands.CompleteTrainingEnrollment;

/// <summary>
/// Handler for <see cref="CompleteTrainingEnrollmentCommand"/>.
/// </summary>
public class CompleteTrainingEnrollmentCommandHandler : IRequestHandler<CompleteTrainingEnrollmentCommand, ApiResponse<TrainingEnrollmentDto>>
{
    private readonly ITrainingRepository _trainingRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CompleteTrainingEnrollmentCommandHandler"/> class.
    /// </summary>
    public CompleteTrainingEnrollmentCommandHandler(
        ITrainingRepository trainingRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _trainingRepository = trainingRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TrainingEnrollmentDto>> Handle(CompleteTrainingEnrollmentCommand request, CancellationToken ct)
    {
        var enrollment = await _trainingRepository.GetEnrollmentByIdAsync(request.Id, ct);
        if (enrollment == null)
        {
            return ApiResponse<TrainingEnrollmentDto>.Fail(ResponseMessage.TrainingEnrollmentNotFound.GetDescription());
        }

        enrollment.Complete();
        _trainingRepository.UpdateEnrollment(enrollment);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<TrainingEnrollmentDto>(enrollment);
        return ApiResponse<TrainingEnrollmentDto>.Success(dto, ResponseMessage.TrainingProgramCompleted.GetDescription());
    }
}
