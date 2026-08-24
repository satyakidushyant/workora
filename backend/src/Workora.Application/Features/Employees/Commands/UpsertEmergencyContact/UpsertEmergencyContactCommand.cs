using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.UpsertEmergencyContact;

/// <summary>
/// Command to add or update an emergency contact for an employee.
/// </summary>
public record UpsertEmergencyContactCommand(
    int EmployeeId,
    int? Id,
    string Name,
    string Relationship,
    string PhoneNumber,
    string? AlternativePhoneNumber,
    bool IsPrimary) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="UpsertEmergencyContactCommand"/>.
/// </summary>
public class UpsertEmergencyContactCommandValidator : AbstractValidator<UpsertEmergencyContactCommand>
{
    /// <summary>
    /// Initializes validation rules for emergency contacts.
    /// </summary>
    public UpsertEmergencyContactCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150).WithMessage("Contact name is required.");
        RuleFor(x => x.Relationship).NotEmpty().MaximumLength(100).WithMessage("Relationship is required.");
        RuleFor(x => x.PhoneNumber).NotEmpty().MaximumLength(50).WithMessage("Phone number is required.");
    }
}

/// <summary>
/// Handler for <see cref="UpsertEmergencyContactCommand"/>.
/// </summary>
public class UpsertEmergencyContactCommandHandler : IRequestHandler<UpsertEmergencyContactCommand, ApiResponse<bool>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpsertEmergencyContactCommandHandler"/> class.
    /// </summary>
    public UpsertEmergencyContactCommandHandler(IEmployeeRepository employeeRepository, IUnitOfWork unitOfWork)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(UpsertEmergencyContactCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetWithFullDetailsAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        if (request.Id.HasValue && request.Id.Value > 0)
        {
            var contact = employee.EmergencyContacts.FirstOrDefault(c => c.Id == request.Id.Value);
            if (contact != null)
            {
                contact.Update(request.Name, request.Relationship, request.PhoneNumber, request.AlternativePhoneNumber, request.IsPrimary);
            }
        }
        else
        {
            var newContact = EmployeeEmergencyContact.Create(
                request.EmployeeId,
                request.Name,
                request.Relationship,
                request.PhoneNumber,
                request.AlternativePhoneNumber,
                request.IsPrimary);

            await _employeeRepository.AddEmergencyContactAsync(newContact, ct);
        }

        await _unitOfWork.SaveChangesAsync(ct);
        return ApiResponse<bool>.Success(true, ResponseMessage.EmergencyContactsUpdated.GetDescription());
    }
}
