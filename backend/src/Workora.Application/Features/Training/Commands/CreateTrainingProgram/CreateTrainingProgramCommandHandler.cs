using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Commands.CreateTrainingProgram;

/// <summary>
/// Handler for <see cref="CreateTrainingProgramCommand"/>.
/// </summary>
public class CreateTrainingProgramCommandHandler : IRequestHandler<CreateTrainingProgramCommand, ApiResponse<TrainingProgramDto>>
{
    private readonly ITrainingRepository _trainingRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateTrainingProgramCommandHandler"/> class.
    /// </summary>
    public CreateTrainingProgramCommandHandler(
        ITrainingRepository trainingRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _trainingRepository = trainingRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TrainingProgramDto>> Handle(CreateTrainingProgramCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<TrainingProgramDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var program = TrainingProgram.Create(
            request.CompanyId,
            request.Title,
            request.Description,
            request.TrainerName,
            request.StartDate,
            request.EndDate,
            request.Capacity);

        await _trainingRepository.AddAsync(program, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<TrainingProgramDto>(program);
        return ApiResponse<TrainingProgramDto>.Success(dto, ResponseMessage.TrainingProgramCreated.GetDescription());
    }
}
