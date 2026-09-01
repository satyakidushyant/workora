using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Users.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Events.Users;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Commands.CreateUser;

/// <summary>
/// Handler for <see cref="CreateUserCommand"/>.
/// </summary>
public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, ApiResponse<UserDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateUserCommandHandler"/> class.
    /// </summary>
    public CreateUserCommandHandler(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IEmployeeRepository employeeRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _employeeRepository = employeeRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<UserDto>> Handle(CreateUserCommand request, CancellationToken ct)
    {
        EmailAddress emailObj;
        try
        {
            emailObj = EmailAddress.Create(request.Email);
        }
        catch (ArgumentException ex)
        {
            return ApiResponse<UserDto>.Fail(ex.Message);
        }

        var isUnique = await _userRepository.IsEmailUniqueAsync(emailObj, ct);
        if (!isUnique)
        {
            return ApiResponse<UserDto>.Fail(ResponseMessage.UserEmailAlreadyExists.GetDescription());
        }

        var hashedPassword = _passwordHasher.HashPassword(request.Password);
        var user = User.Create(emailObj, request.FirstName, request.LastName, hashedPassword, request.EmployeeId);

        await _userRepository.AddAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        // Assign explicit role if requested, otherwise default to Employee role
        if (request.RoleId.HasValue && request.RoleId.Value > 0)
        {
            await _userRepository.AssignUserRolesAsync(user.Id, new[] { request.RoleId.Value }, ct);
            await _unitOfWork.SaveChangesAsync(ct);
        }
        else
        {
            var defaultRole = await _roleRepository.GetByNameAsync("Employee", ct);
            if (defaultRole != null)
            {
                await _userRepository.AssignUserRolesAsync(user.Id, new[] { defaultRole.Id }, ct);
                await _unitOfWork.SaveChangesAsync(ct);
            }
        }

        // Link Employee back to this User if an Employee was specified
        if (request.EmployeeId.HasValue && request.EmployeeId.Value > 0)
        {
            var emp = await _employeeRepository.GetByIdAsync(request.EmployeeId.Value, ct);
            if (emp != null && emp.UserId != user.Id)
            {
                emp.LinkUser(user.Id);
                await _unitOfWork.SaveChangesAsync(ct);
            }
        }

        var freshUser = await _userRepository.GetByIdAsync(user.Id, ct) ?? user;
        var dto = _mapper.Map<UserDto>(freshUser);

        // Enrich DTO with company metadata
        if (request.EmployeeId.HasValue)
        {
            var emp = await _employeeRepository.GetWithFullDetailsAsync(request.EmployeeId.Value, ct);
            if (emp != null)
            {
                dto.EmployeeId = emp.Id;
                dto.EmployeeCode = emp.EmployeeCode;
                dto.DepartmentName = emp.Department?.Name;
                var cid = emp.Department?.CompanyId ?? emp.Branch?.CompanyId;
                if (cid.HasValue)
                {
                    var comp = await _companyRepository.GetByIdAsync(cid.Value, ct);
                    if (comp != null)
                    {
                        dto.CompanyId = comp.Id;
                        dto.CompanyName = comp.Name;
                        dto.CompanyCode = comp.Code;
                    }
                }
            }
        }

        return ApiResponse<UserDto>.Success(dto);
    }
}

