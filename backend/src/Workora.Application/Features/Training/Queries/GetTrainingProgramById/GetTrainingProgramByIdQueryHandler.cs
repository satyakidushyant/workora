using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Queries.GetTrainingProgramById;

/// <summary>
/// Handler for <see cref="GetTrainingProgramByIdQuery"/>.
/// </summary>
public class GetTrainingProgramByIdQueryHandler : IRequestHandler<GetTrainingProgramByIdQuery, ApiResponse<TrainingProgramDto>>
{
    private readonly ITrainingRepository _trainingRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetTrainingProgramByIdQueryHandler"/> class.
    /// </summary>
    public GetTrainingProgramByIdQueryHandler(ITrainingRepository trainingRepository, IMapper mapper)
    {
        _trainingRepository = trainingRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TrainingProgramDto>> Handle(GetTrainingProgramByIdQuery request, CancellationToken ct)
    {
        var program = await _trainingRepository.GetWithEnrollmentsAsync(request.Id, ct);
        if (program == null)
        {
            return ApiResponse<TrainingProgramDto>.Fail(ResponseMessage.TrainingProgramNotFound.GetDescription());
        }

        var dto = _mapper.Map<TrainingProgramDto>(program);
        return ApiResponse<TrainingProgramDto>.Success(dto);
    }
}
