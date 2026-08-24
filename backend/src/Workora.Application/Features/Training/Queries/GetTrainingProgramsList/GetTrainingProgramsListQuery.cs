using AutoMapper;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Queries.GetTrainingProgramsList;

/// <summary>
/// Query to retrieve a paginated list of training programs.
/// </summary>
public record GetTrainingProgramsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<TrainingProgramDto>>>;

/// <summary>
/// Handler for <see cref="GetTrainingProgramsListQuery"/>.
/// </summary>
public class GetTrainingProgramsListQueryHandler : IRequestHandler<GetTrainingProgramsListQuery, ApiResponse<PagedResponse<TrainingProgramDto>>>
{
    private readonly ITrainingRepository _trainingRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetTrainingProgramsListQueryHandler"/> class.
    /// </summary>
    public GetTrainingProgramsListQueryHandler(ITrainingRepository trainingRepository, IMapper mapper)
    {
        _trainingRepository = trainingRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<TrainingProgramDto>>> Handle(GetTrainingProgramsListQuery request, CancellationToken ct)
    {
        var programs = await _trainingRepository.GetProgramsPagedAsync(request.PageNumber, request.PageSize, request.CompanyId, ct);
        var totalCount = await _trainingRepository.GetProgramsCountAsync(request.CompanyId, ct);

        var dtos = _mapper.Map<IReadOnlyList<TrainingProgramDto>>(programs);
        var paged = new PagedResponse<TrainingProgramDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<TrainingProgramDto>>.Success(paged);
    }
}
