using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Commands.CreateHoliday;

/// <summary>
/// Handler for <see cref="CreateHolidayCommand"/>.
/// </summary>
public class CreateHolidayCommandHandler : IRequestHandler<CreateHolidayCommand, ApiResponse<HolidayDto>>
{
    private readonly IHolidayRepository _holidayRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateHolidayCommandHandler"/> class.
    /// </summary>
    public CreateHolidayCommandHandler(
        IHolidayRepository holidayRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _holidayRepository = holidayRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<HolidayDto>> Handle(CreateHolidayCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<HolidayDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var isUnique = await _holidayRepository.IsDateUniqueAsync(request.CompanyId, request.Date, request.BranchId, null, ct);
        if (!isUnique)
        {
            return ApiResponse<HolidayDto>.Fail(ResponseMessage.HolidayAlreadyExists.GetDescription());
        }

        var holiday = Holiday.Create(
            request.CompanyId,
            request.Name,
            request.Date,
            request.Type,
            request.BranchId,
            request.Description);

        await _holidayRepository.AddAsync(holiday, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<HolidayDto>(holiday);
        return ApiResponse<HolidayDto>.Success(dto, ResponseMessage.HolidayCreated.GetDescription());
    }
}
