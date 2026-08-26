using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Queries.GetCompanyProfile;

/// <summary>
/// Query to get the default or primary company profile.
/// </summary>
public record GetCompanyProfileQuery(int? CompanyId = null) : IRequest<ApiResponse<CompanyDto>>;

/// <summary>
/// Handler for <see cref="GetCompanyProfileQuery"/>.
/// </summary>
public class GetCompanyProfileQueryHandler : IRequestHandler<GetCompanyProfileQuery, ApiResponse<CompanyDto>>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetCompanyProfileQueryHandler"/> class.
    /// </summary>
    public GetCompanyProfileQueryHandler(
        ICompanyRepository companyRepository,
        IUserRepository userRepository,
        IEmployeeRepository employeeRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _companyRepository = companyRepository;
        _userRepository = userRepository;
        _employeeRepository = employeeRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<CompanyDto>> Handle(GetCompanyProfileQuery request, CancellationToken ct)
    {
        int? targetCompanyId = request.CompanyId;

        // If not specified by request, attempt to resolve user's tenant company from their linked employee profile
        if (!targetCompanyId.HasValue && _currentUserService.UserId.HasValue)
        {
            var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
            if (user != null && user.EmployeeId.HasValue)
            {
                var employee = await _employeeRepository.GetWithFullDetailsAsync(user.EmployeeId.Value, ct);
                if (employee != null)
                {
                    targetCompanyId = employee.Department?.CompanyId ?? employee.Branch?.CompanyId;
                }
            }
        }

        var company = targetCompanyId.HasValue
            ? await _companyRepository.GetByIdAsync(targetCompanyId.Value, ct)
            : await _companyRepository.GetDefaultCompanyAsync(ct);

        if (company == null)
        {
            company = await _companyRepository.GetDefaultCompanyAsync(ct);
        }

        if (company == null)
        {
            return ApiResponse<CompanyDto>.Fail("Company profile not found.");
        }

        var dto = _mapper.Map<CompanyDto>(company);
        return ApiResponse<CompanyDto>.Success(dto);
    }
}
