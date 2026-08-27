using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Commands.EnrollInTraining;

/// <summary>
/// Handler for <see cref="EnrollInTrainingCommand"/>.
/// </summary>
public class EnrollInTrainingCommandHandler : IRequestHandler<EnrollInTrainingCommand, ApiResponse<TrainingEnrollmentDto>>
{
    private readonly ITrainingRepository _trainingRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="EnrollInTrainingCommandHandler"/> class.
    /// </summary>
    public EnrollInTrainingCommandHandler(
        ITrainingRepository trainingRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _trainingRepository = trainingRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TrainingEnrollmentDto>> Handle(EnrollInTrainingCommand request, CancellationToken ct)
    {
        var program = await _trainingRepository.GetWithEnrollmentsAsync(request.TrainingProgramId, ct);
        if (program == null)
        {
            return ApiResponse<TrainingEnrollmentDto>.Fail(ResponseMessage.TrainingProgramNotFound.GetDescription());
        }

        if (program.Enrollments.Count >= program.Capacity)
        {
            return ApiResponse<TrainingEnrollmentDto>.Fail("Training program is at full capacity.");
        }

        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<TrainingEnrollmentDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var enrollment = TrainingEnrollment.Create(request.TrainingProgramId, request.EmployeeId);
        await _trainingRepository.AddEnrollmentAsync(enrollment, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var loaded = await _trainingRepository.GetEnrollmentByIdAsync(enrollment.Id, ct);
        var dto = _mapper.Map<TrainingEnrollmentDto>(loaded ?? enrollment);
        return ApiResponse<TrainingEnrollmentDto>.Success(dto, ResponseMessage.EmployeeEnrolledInTraining.GetDescription());
    }
}
