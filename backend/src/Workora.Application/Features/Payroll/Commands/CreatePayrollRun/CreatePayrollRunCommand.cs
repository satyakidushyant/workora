using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.CreatePayrollRun;

/// <summary>
/// Command to initiate and calculate monthly payroll for all eligible employees in a company.
/// </summary>
public record CreatePayrollRunCommand(
    int CompanyId,
    int PeriodMonth,
    int PeriodYear) : IRequest<ApiResponse<PayrollRunDetailDto>>;

/// <summary>
/// Validator for <see cref="CreatePayrollRunCommand"/>.
/// </summary>
public class CreatePayrollRunCommandValidator : AbstractValidator<CreatePayrollRunCommand>
{
    /// <summary>
    /// Initializes validation rules for initiating payroll run.
    /// </summary>
    public CreatePayrollRunCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.PeriodMonth).InclusiveBetween(1, 12).WithMessage("Month must be between 1 and 12.");
        RuleFor(x => x.PeriodYear).GreaterThanOrEqualTo(2020).WithMessage("Valid year is required.");
    }
}

/// <summary>
/// Handler for <see cref="CreatePayrollRunCommand"/>.
/// </summary>
public class CreatePayrollRunCommandHandler : IRequestHandler<CreatePayrollRunCommand, ApiResponse<PayrollRunDetailDto>>
{
    private readonly IPayrollRepository _payrollRepository;
    private readonly ISalaryStructureRepository _salaryStructureRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreatePayrollRunCommandHandler"/> class.
    /// </summary>
    public CreatePayrollRunCommandHandler(
        IPayrollRepository payrollRepository,
        ISalaryStructureRepository salaryStructureRepository,
        IEmployeeRepository employeeRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _payrollRepository = payrollRepository;
        _salaryStructureRepository = salaryStructureRepository;
        _employeeRepository = employeeRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PayrollRunDetailDto>> Handle(CreatePayrollRunCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<PayrollRunDetailDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var existing = await _payrollRepository.GetByPeriodAsync(request.CompanyId, request.PeriodMonth, request.PeriodYear, ct);
        if (existing != null && existing.Status != PayrollStatus.Draft)
        {
            return ApiResponse<PayrollRunDetailDto>.Fail($"A payroll run for {request.PeriodMonth}/{request.PeriodYear} already exists with status {existing.Status}.");
        }

        var payrollRun = existing ?? PayrollRun.Create(request.CompanyId, request.PeriodMonth, request.PeriodYear);

        var employees = await _employeeRepository.GetExportListAsync(status: EmploymentStatus.Active, ct: ct);
        var targetDate = new DateOnly(request.PeriodYear, request.PeriodMonth, 1);

        var payslips = new List<Payslip>();

        foreach (var emp in employees)
        {
            var assignment = await _salaryStructureRepository.GetActiveEmployeeAssignmentAsync(emp.Id, targetDate, ct);
            if (assignment == null || assignment.SalaryStructure == null) continue;

            var baseSalary = assignment.BaseSalary;
            var items = new List<PayslipItem>();

            // Basic salary item
            items.Add(PayslipItem.Create(0, "Base Basic Salary", "BASIC", ComponentType.Earning, baseSalary));

            decimal grossEarnings = baseSalary;
            decimal totalDeductions = 0;

            foreach (var comp in assignment.SalaryStructure.Components)
            {
                decimal amount;
                if (comp.CalculationType == CalculationType.Fixed)
                {
                    amount = comp.DefaultValue;
                }
                else if (comp.CalculationType == CalculationType.PercentageOfBasic)
                {
                    amount = Math.Round((baseSalary * comp.DefaultValue) / 100m, 2);
                }
                else // PercentageOfGross
                {
                    amount = Math.Round((grossEarnings * comp.DefaultValue) / 100m, 2);
                }

                if (comp.Type == ComponentType.Earning)
                {
                    grossEarnings += amount;
                    items.Add(PayslipItem.Create(0, comp.Name, comp.Code, ComponentType.Earning, amount));
                }
                else
                {
                    totalDeductions += amount;
                    items.Add(PayslipItem.Create(0, comp.Name, comp.Code, ComponentType.Deduction, amount));
                }
            }

            var netSalary = Math.Max(0, grossEarnings - totalDeductions);

            var payslip = Payslip.Create(
                payrollRun.Id,
                emp.Id,
                emp.EmployeeCode,
                $"{emp.FirstName} {emp.LastName}".Trim(),
                grossEarnings,
                totalDeductions,
                netSalary,
                items);

            payslips.Add(payslip);
        }

        payrollRun.SetPayslips(payslips);

        if (existing == null)
        {
            await _payrollRepository.AddAsync(payrollRun, ct);
        }
        else
        {
            _payrollRepository.Update(payrollRun);
        }

        await _unitOfWork.SaveChangesAsync(ct);

        var fullyLoaded = await _payrollRepository.GetWithPayslipsAsync(payrollRun.Id, ct);
        var dto = _mapper.Map<PayrollRunDetailDto>(fullyLoaded ?? payrollRun);
        return ApiResponse<PayrollRunDetailDto>.Success(dto, ResponseMessage.PayrollRunCreated.GetDescription());
    }
}
