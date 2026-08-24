using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Commands.DeleteDepartment;

/// <summary>
/// Command to delete a department.
/// </summary>
public record DeleteDepartmentCommand(int Id) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="DeleteDepartmentCommand"/>.
/// </summary>
public class DeleteDepartmentCommandHandler : IRequestHandler<DeleteDepartmentCommand, ApiResponse<bool>>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteDepartmentCommandHandler"/> class.
    /// </summary>
    public DeleteDepartmentCommandHandler(IDepartmentRepository departmentRepository, IUnitOfWork unitOfWork)
    {
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(DeleteDepartmentCommand request, CancellationToken ct)
    {
        var department = await _departmentRepository.GetByIdAsync(request.Id, ct);
        if (department == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.DepartmentNotFound.GetDescription());
        }

        _departmentRepository.Remove(department);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.DepartmentDeleted.GetDescription());
    }
}
