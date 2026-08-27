using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.CreatePerformanceCycle;

/// <summary>
/// Handler for <see cref="CreatePerformanceCycleCommand"/>.
/// </summary>
public class CreatePerformanceCycleCommandHandler : IRequestHandler<CreatePerformanceCycleCommand, ApiResponse<PerformanceCycleDto>>
{
    private readonly IGenericRepository<Appraisal> _appraisalRepository;
    private readonly IGenericRepository<Employee> _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreatePerformanceCycleCommandHandler"/> class.
    /// </summary>
    public CreatePerformanceCycleCommandHandler(
        IGenericRepository<Appraisal> appraisalRepository,
        IGenericRepository<Employee> employeeRepository,
        IUnitOfWork unitOfWork)
    {
        _appraisalRepository = appraisalRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes performance cycle creation across company employees.
    /// </summary>
    public async Task<ApiResponse<PerformanceCycleDto>> Handle(CreatePerformanceCycleCommand request, CancellationToken cancellationToken)
    {
        var employees = _employeeRepository.GetQueryable()
            .ToList();

        int sampleId = 0;
        foreach (var emp in employees)
        {
            var appraisal = Appraisal.Create(
                emp.Id,
                emp.ManagerId ?? emp.Id,
                request.Title,
                request.Year);

            await _appraisalRepository.AddAsync(appraisal, cancellationToken);
            if (sampleId == 0) sampleId = appraisal.Id;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = new PerformanceCycleDto
        {
            Id = sampleId,
            CompanyId = request.CompanyId,
            Title = request.Title,
            Year = request.Year,
            IsActive = true
        };

        return ApiResponse<PerformanceCycleDto>.Success(dto, $"Performance review cycle '{request.Title}' initialized successfully for {employees.Count} employees.");
    }
}
