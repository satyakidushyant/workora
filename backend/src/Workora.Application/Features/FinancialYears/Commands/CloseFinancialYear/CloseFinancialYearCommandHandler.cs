using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.FinancialYears.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FinancialYears.Commands.CloseFinancialYear;

/// <summary>
/// Handler for <see cref="CloseFinancialYearCommand"/>.
/// </summary>
public class CloseFinancialYearCommandHandler : IRequestHandler<CloseFinancialYearCommand, ApiResponse<FinancialYearDto>>
{
    private readonly IFinancialYearRepository _financialYearRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CloseFinancialYearCommandHandler"/> class.
    /// </summary>
    public CloseFinancialYearCommandHandler(
        IFinancialYearRepository financialYearRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _financialYearRepository = financialYearRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<FinancialYearDto>> Handle(CloseFinancialYearCommand request, CancellationToken ct)
    {
        var financialYear = await _financialYearRepository.GetByIdAsync(request.Id, ct);
        if (financialYear == null)
        {
            return ApiResponse<FinancialYearDto>.Fail(ResponseMessage.NotFound.GetDescription());
        }

        if (financialYear.IsClosed)
        {
            return ApiResponse<FinancialYearDto>.Fail("This financial year is already closed.");
        }

        financialYear.Close();
        _financialYearRepository.Update(financialYear);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<FinancialYearDto>(financialYear);
        return ApiResponse<FinancialYearDto>.Success(dto, ResponseMessage.Updated.GetDescription());
    }
}
