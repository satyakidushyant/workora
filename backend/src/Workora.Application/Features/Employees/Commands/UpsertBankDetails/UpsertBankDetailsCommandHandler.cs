using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.UpsertBankDetails;

/// <summary>
/// Handler for <see cref="UpsertBankDetailsCommand"/>.
/// </summary>
public class UpsertBankDetailsCommandHandler : IRequestHandler<UpsertBankDetailsCommand, ApiResponse<bool>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpsertBankDetailsCommandHandler"/> class.
    /// </summary>
    public UpsertBankDetailsCommandHandler(IEmployeeRepository employeeRepository, IUnitOfWork unitOfWork)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(UpsertBankDetailsCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetWithFullDetailsAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        if (request.Id.HasValue && request.Id.Value > 0)
        {
            var detail = employee.BankDetails.FirstOrDefault(b => b.Id == request.Id.Value);
            if (detail != null)
            {
                detail.Update(request.BankName, request.AccountNumber, request.AccountHolderName, request.BranchCode, request.SwiftCode, request.IsPrimary);
                await _employeeRepository.UpsertBankDetailAsync(detail, ct);
            }
        }
        else
        {
            var newDetail = EmployeeBankDetail.Create(
                request.EmployeeId,
                request.BankName,
                request.AccountNumber,
                request.AccountHolderName,
                request.BranchCode,
                request.SwiftCode,
                request.IsPrimary);

            await _employeeRepository.UpsertBankDetailAsync(newDetail, ct);
        }

        await _unitOfWork.SaveChangesAsync(ct);
        return ApiResponse<bool>.Success(true, ResponseMessage.BankDetailsUpdated.GetDescription());
    }
}
