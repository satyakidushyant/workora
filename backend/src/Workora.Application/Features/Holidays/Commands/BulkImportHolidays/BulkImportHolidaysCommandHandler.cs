using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Holidays.Commands.BulkImportHolidays;

/// <summary>
/// Handler for <see cref="BulkImportHolidaysCommand"/>.
/// </summary>
public class BulkImportHolidaysCommandHandler : IRequestHandler<BulkImportHolidaysCommand, ApiResponse<int>>
{
    private readonly IGenericRepository<Holiday> _holidayRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="BulkImportHolidaysCommandHandler"/> class.
    /// </summary>
    public BulkImportHolidaysCommandHandler(
        IGenericRepository<Holiday> holidayRepository,
        IUnitOfWork unitOfWork)
    {
        _holidayRepository = holidayRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes bulk holiday import.
    /// </summary>
    public async Task<ApiResponse<int>> Handle(BulkImportHolidaysCommand request, CancellationToken cancellationToken)
    {
        int count = 0;
        foreach (var item in request.Holidays)
        {
            var holiday = Holiday.Create(
                item.CompanyId,
                item.Name,
                item.Date,
                item.Type,
                item.BranchId);

            await _holidayRepository.AddAsync(holiday, cancellationToken);
            count++;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return ApiResponse<int>.Success(count, $"{count} holidays imported successfully.");
    }
}
