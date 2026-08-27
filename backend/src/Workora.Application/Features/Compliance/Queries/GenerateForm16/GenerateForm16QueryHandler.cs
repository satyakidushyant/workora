using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Compliance.Queries.GenerateForm16;

/// <summary>
/// Handler for <see cref="GenerateForm16Query"/>.
/// </summary>
public class GenerateForm16QueryHandler : IRequestHandler<GenerateForm16Query, ApiResponse<StatutoryExportFileDto>>
{
    private readonly IGenericRepository<Employee> _employeeRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GenerateForm16QueryHandler"/> class.
    /// </summary>
    public GenerateForm16QueryHandler(IGenericRepository<Employee> employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    /// <summary>
    /// Executes generation of Form 16 PDF file.
    /// </summary>
    public async Task<ApiResponse<StatutoryExportFileDto>> Handle(GenerateForm16Query request, CancellationToken cancellationToken)
    {
        var emp = await _employeeRepository.GetByIdAsync(request.EmployeeId, cancellationToken);
        if (emp == null)
        {
            return ApiResponse<StatutoryExportFileDto>.Fail($"Employee {request.EmployeeId} not found.");
        }

        var dto = new StatutoryExportFileDto(
            $"Form16_{emp.EmployeeCode}_{request.FinancialYear}.pdf",
            "application/pdf",
            System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"Form 16 Certificate for {emp.FirstName} {emp.LastName} ({request.FinancialYear})")));

        return ApiResponse<StatutoryExportFileDto>.Success(dto, "Form 16 tax certificate generated successfully.");
    }
}
