using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Commands.CreateShift;

/// <summary>
/// Handler for <see cref="CreateShiftCommand"/>.
/// </summary>
public class CreateShiftCommandHandler : IRequestHandler<CreateShiftCommand, ApiResponse<ShiftDto>>
{
    private readonly IShiftRepository _shiftRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateShiftCommandHandler"/> class.
    /// </summary>
    public CreateShiftCommandHandler(
        IShiftRepository shiftRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _shiftRepository = shiftRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<ShiftDto>> Handle(CreateShiftCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<ShiftDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var isUnique = await _shiftRepository.IsCodeUniqueAsync(request.CompanyId, request.Code, null, ct);
        if (!isUnique)
        {
            return ApiResponse<ShiftDto>.Fail("A shift with this code already exists for the company.");
        }

        var shift = Shift.Create(
            request.CompanyId,
            request.Name,
            request.Code,
            request.StartTime,
            request.EndTime,
            request.SpansMidnight,
            request.GracePeriodMinutes,
            request.BreakMinutes,
            request.BranchId,
            request.Description);

        await _shiftRepository.AddAsync(shift, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<ShiftDto>(shift);
        return ApiResponse<ShiftDto>.Success(dto, ResponseMessage.ShiftCreated.GetDescription());
    }
}
