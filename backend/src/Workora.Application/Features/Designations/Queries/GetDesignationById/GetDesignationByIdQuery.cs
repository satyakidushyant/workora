using AutoMapper;
using MediatR;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Queries.GetDesignationById;

/// <summary>
/// Query to retrieve a designation by ID.
/// </summary>
public record GetDesignationByIdQuery(int Id) : IRequest<ApiResponse<DesignationDto>>;

/// <summary>
/// Handler for <see cref="GetDesignationByIdQuery"/>.
/// </summary>
public class GetDesignationByIdQueryHandler : IRequestHandler<GetDesignationByIdQuery, ApiResponse<DesignationDto>>
{
    private readonly IDesignationRepository _designationRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDesignationByIdQueryHandler"/> class.
    /// </summary>
    public GetDesignationByIdQueryHandler(IDesignationRepository designationRepository, IMapper mapper)
    {
        _designationRepository = designationRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DesignationDto>> Handle(GetDesignationByIdQuery request, CancellationToken ct)
    {
        var designation = await _designationRepository.GetByIdAsync(request.Id, ct);
        if (designation == null)
        {
            return ApiResponse<DesignationDto>.Fail("Designation not found.");
        }

        var dto = _mapper.Map<DesignationDto>(designation);
        return ApiResponse<DesignationDto>.Success(dto);
    }
}
