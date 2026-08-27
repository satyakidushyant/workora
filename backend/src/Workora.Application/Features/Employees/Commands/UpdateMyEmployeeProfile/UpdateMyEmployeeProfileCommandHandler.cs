using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.UpdateMyEmployeeProfile;

/// <summary>
/// Handler for <see cref="UpdateMyEmployeeProfileCommand"/>.
/// </summary>
public class UpdateMyEmployeeProfileCommandHandler : IRequestHandler<UpdateMyEmployeeProfileCommand, ApiResponse<EmployeeDetailDto>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateMyEmployeeProfileCommandHandler"/> class.
    /// </summary>
    public UpdateMyEmployeeProfileCommandHandler(
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<EmployeeDetailDto>> Handle(UpdateMyEmployeeProfileCommand request, CancellationToken ct)
    {
        if (_currentUserService.UserId == null)
        {
            return ApiResponse<EmployeeDetailDto>.Fail(ResponseMessage.UserContextUnavailable.GetDescription());
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<EmployeeDetailDto>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<EmployeeDetailDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        employee.UpdateSelfProfile(request.Phone, request.Address);
        _employeeRepository.Update(employee);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<EmployeeDetailDto>(employee);
        return ApiResponse<EmployeeDetailDto>.Success(dto, ResponseMessage.EmployeeUpdated.GetDescription());
    }
}
