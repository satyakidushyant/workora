using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.FinancialYears.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FinancialYears.Commands.CreateFinancialYear;

/// <summary>
/// Handler for <see cref="CreateFinancialYearCommand"/>.
/// </summary>
public class CreateFinancialYearCommandHandler : IRequestHandler<CreateFinancialYearCommand, ApiResponse<FinancialYearDto>>
{
    private readonly IFinancialYearRepository _financialYearRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateFinancialYearCommandHandler"/> class.
    /// </summary>
    public CreateFinancialYearCommandHandler(
        IFinancialYearRepository financialYearRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _financialYearRepository = financialYearRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<FinancialYearDto>> Handle(CreateFinancialYearCommand request, CancellationToken ct)
    {
        var financialYear = FinancialYear.Create(request.Name, request.StartDate, request.EndDate, request.IsCurrent);

        if (request.IsCurrent)
        {
            var hasCurrent = await _financialYearRepository.HasCurrentYearAsync(0, ct);
            if (hasCurrent)
            {
                return ApiResponse<FinancialYearDto>.Fail(ResponseMessage.FinancialYearActiveAlreadyExists.GetDescription());
            }
            financialYear.SetAsCurrent();
        }

        await _financialYearRepository.AddAsync(financialYear, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<FinancialYearDto>(financialYear);
        return ApiResponse<FinancialYearDto>.Success(dto, ResponseMessage.Created.GetDescription());
    }
}
