using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Performance.Cycles;

/// <summary>
/// DTO representing an appraisal performance review cycle.
/// </summary>
public class PerformanceCycleDto
{
    /// <summary>
    /// Gets or sets cycle identifier.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets company ID.
    /// </summary>
    public int CompanyId { get; set; }

    /// <summary>
    /// Gets or sets cycle title / period (e.g. "Annual Review 2026", "H1 KPI Appraisal").
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets cycle year.
    /// </summary>
    public int Year { get; set; }

    /// <summary>
    /// Gets or sets active status flag.
    /// </summary>
    public bool IsActive { get; set; }
}

/// <summary>
/// Query to list performance review cycles.
/// </summary>
public record GetPerformanceCyclesQuery(int CompanyId) : IRequest<ApiResponse<IReadOnlyList<PerformanceCycleDto>>>;

/// <summary>
/// Handler for <see cref="GetPerformanceCyclesQuery"/>.
/// </summary>
public class GetPerformanceCyclesQueryHandler : IRequestHandler<GetPerformanceCyclesQuery, ApiResponse<IReadOnlyList<PerformanceCycleDto>>>
{
    private readonly IGenericRepository<Appraisal> _appraisalRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPerformanceCyclesQueryHandler"/> class.
    /// </summary>
    public GetPerformanceCyclesQueryHandler(IGenericRepository<Appraisal> appraisalRepository)
    {
        _appraisalRepository = appraisalRepository;
    }

    /// <summary>
    /// Executes retrieval of performance appraisal cycles.
    /// </summary>
    public async Task<ApiResponse<IReadOnlyList<PerformanceCycleDto>>> Handle(GetPerformanceCyclesQuery request, CancellationToken cancellationToken)
    {
        var items = _appraisalRepository.GetQueryable()
            .ToList()
            .GroupBy(a => a.Period)
            .Select(g => new PerformanceCycleDto
            {
                Id = g.First().Id,
                CompanyId = request.CompanyId,
                Title = g.Key,
                Year = g.First().Year,
                IsActive = g.First().IsActive
            })
            .ToList();

        return ApiResponse<IReadOnlyList<PerformanceCycleDto>>.Success(items, "Performance review cycles retrieved successfully.");
    }
}

/// <summary>
/// Command to create a performance appraisal review cycle.
/// </summary>
public record CreatePerformanceCycleCommand(
    int CompanyId,
    string Title,
    int Year) : IRequest<ApiResponse<PerformanceCycleDto>>;

/// <summary>
/// Validator for <see cref="CreatePerformanceCycleCommand"/>.
/// </summary>
public class CreatePerformanceCycleCommandValidator : AbstractValidator<CreatePerformanceCycleCommand>
{
    /// <summary>
    /// Initializes validation rules for CreatePerformanceCycleCommand.
    /// </summary>
    public CreatePerformanceCycleCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Performance cycle title is required.");
        RuleFor(x => x.CompanyId).GreaterThan(0);
        RuleFor(x => x.Year).GreaterThan(2000);
    }
}

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
