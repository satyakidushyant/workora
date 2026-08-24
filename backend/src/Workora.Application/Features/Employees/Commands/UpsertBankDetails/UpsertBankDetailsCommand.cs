using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.UpsertBankDetails;

/// <summary>
/// Command to create or update an employee's bank disbursement details.
/// </summary>
public record UpsertBankDetailsCommand(
    int EmployeeId,
    int? Id,
    string BankName,
    string AccountNumber,
    string AccountHolderName,
    string? BranchCode,
    string? SwiftCode,
    bool IsPrimary) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="UpsertBankDetailsCommand"/>.
/// </summary>
public class UpsertBankDetailsCommandValidator : AbstractValidator<UpsertBankDetailsCommand>
{
    /// <summary>
    /// Initializes validation rules for bank details.
    /// </summary>
    public UpsertBankDetailsCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.BankName).NotEmpty().MaximumLength(150).WithMessage("Bank name is required.");
        RuleFor(x => x.AccountNumber).NotEmpty().MaximumLength(100).WithMessage("Account number is required.");
        RuleFor(x => x.AccountHolderName).NotEmpty().MaximumLength(150).WithMessage("Account holder name is required.");
    }
}

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
