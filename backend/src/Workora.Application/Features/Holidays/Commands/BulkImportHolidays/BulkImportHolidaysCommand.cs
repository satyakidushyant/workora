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
/// Model for a single holiday row in a bulk import payload.
/// </summary>
public record BulkHolidayItem(
    string Name,
    DateOnly Date,
    HolidayType Type,
    int? BranchId,
    int CompanyId);

/// <summary>
/// Command to bulk import holiday calendar entries.
/// </summary>
public record BulkImportHolidaysCommand(List<BulkHolidayItem> Holidays) : IRequest<ApiResponse<int>>;

/// <summary>
/// Validator for <see cref="BulkImportHolidaysCommand"/>.
/// </summary>
public class BulkImportHolidaysCommandValidator : AbstractValidator<BulkImportHolidaysCommand>
{
    /// <summary>
    /// Initializes validation rules for BulkImportHolidaysCommand.
    /// </summary>
    public BulkImportHolidaysCommandValidator()
    {
        RuleFor(x => x.Holidays)
            .NotEmpty().WithMessage("Holiday import list cannot be empty.");
    }
}

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
