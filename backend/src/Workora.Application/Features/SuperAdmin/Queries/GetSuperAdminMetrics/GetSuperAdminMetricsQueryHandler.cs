using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.SuperAdmin.Queries.GetSuperAdminMetrics;

/// <summary>
/// Handler for <see cref="GetSuperAdminMetricsQuery"/>.
/// </summary>
public class GetSuperAdminMetricsQueryHandler : IRequestHandler<GetSuperAdminMetricsQuery, ApiResponse<SuperAdminMetricsDto>>
{
    private readonly IGenericRepository<Company> _companyRepository;
    private readonly IGenericRepository<User> _userRepository;
    private readonly IGenericRepository<Employee> _employeeRepository;
    private readonly IGenericRepository<SubscriptionPlan> _planRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetSuperAdminMetricsQueryHandler"/> class.
    /// </summary>
    public GetSuperAdminMetricsQueryHandler(
        IGenericRepository<Company> companyRepository,
        IGenericRepository<User> userRepository,
        IGenericRepository<Employee> employeeRepository,
        IGenericRepository<SubscriptionPlan> planRepository)
    {
        _companyRepository = companyRepository;
        _userRepository = userRepository;
        _employeeRepository = employeeRepository;
        _planRepository = planRepository;
    }

    /// <summary>
    /// Handles aggregating global platform metrics.
    /// </summary>
    public Task<ApiResponse<SuperAdminMetricsDto>> Handle(GetSuperAdminMetricsQuery request, CancellationToken cancellationToken)
    {
        var companies = _companyRepository.GetQueryable().ToList();
        var users = _userRepository.GetQueryable().ToList();
        var employees = _employeeRepository.GetQueryable().ToList();
        var plans = _planRepository.GetQueryable().ToList();

        var metrics = new SuperAdminMetricsDto
        {
            TotalOrganizations = companies.Count,
            ActiveOrganizations = companies.Count(c => c.IsActive),
            SuspendedOrganizations = companies.Count(c => !c.IsActive),
            TotalSystemUsers = users.Count,
            TotalEmployees = employees.Count,
            ActiveSubscriptionPlans = plans.Count
        };

        return Task.FromResult(ApiResponse<SuperAdminMetricsDto>.Success(metrics, ResponseMessage.SuperAdminMetricsRetrieved.GetDescription()));
    }
}
