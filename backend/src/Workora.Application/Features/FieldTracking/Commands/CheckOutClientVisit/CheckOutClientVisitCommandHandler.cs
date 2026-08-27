using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.Commands.CheckOutClientVisit;

/// <summary>
/// Handler for <see cref="CheckOutClientVisitCommand"/>.
/// </summary>
public class CheckOutClientVisitCommandHandler : IRequestHandler<CheckOutClientVisitCommand, ApiResponse<FieldVisitDto>>
{
    private readonly IFieldVisitRepository _fieldVisitRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public CheckOutClientVisitCommandHandler(
        IFieldVisitRepository fieldVisitRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _fieldVisitRepository = fieldVisitRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<FieldVisitDto>> Handle(CheckOutClientVisitCommand request, CancellationToken ct)
    {
        var visit = await _fieldVisitRepository.GetByIdAsync(request.VisitId, ct);
        if (visit == null)
        {
            return ApiResponse<FieldVisitDto>.Fail("Field visit record not found.");
        }

        visit.CheckOut(
            request.Latitude,
            request.Longitude,
            request.DistanceTraveledKm,
            request.MeetingNotes,
            request.SignatureUrl);

        _fieldVisitRepository.Update(visit);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<FieldVisitDto>(visit);
        return ApiResponse<FieldVisitDto>.Success(dto, "Visit check-out recorded successfully.");
    }
}
