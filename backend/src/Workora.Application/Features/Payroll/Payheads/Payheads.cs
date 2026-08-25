using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Payroll.Payheads;

/// <summary>
/// DTO representing a payhead / salary component definition.
/// </summary>
public class PayheadDto
{
    /// <summary>
    /// Gets or sets component ID.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets component name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets component code.
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets component type (Earning or Deduction).
    /// </summary>
    public ComponentType Type { get; set; }

    /// <summary>
    /// Gets or sets calculation type.
    /// </summary>
    public CalculationType CalculationType { get; set; }

    /// <summary>
    /// Gets or sets default value.
    /// </summary>
    public decimal DefaultValue { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether component is taxable.
    /// </summary>
    public bool IsTaxable { get; set; }
}

/// <summary>
/// Query to list salary payheads.
/// </summary>
public record GetPayheadsListQuery(int? CompanyId = null) : IRequest<ApiResponse<IReadOnlyList<PayheadDto>>>;

/// <summary>
/// Handler for <see cref="GetPayheadsListQuery"/>.
/// </summary>
public class GetPayheadsListQueryHandler : IRequestHandler<GetPayheadsListQuery, ApiResponse<IReadOnlyList<PayheadDto>>>
{
    private readonly IGenericRepository<SalaryComponent> _componentRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPayheadsListQueryHandler"/> class.
    /// </summary>
    public GetPayheadsListQueryHandler(IGenericRepository<SalaryComponent> componentRepository)
    {
        _componentRepository = componentRepository;
    }

    /// <summary>
    /// Executes retrieval of salary payheads.
    /// </summary>
    public Task<ApiResponse<IReadOnlyList<PayheadDto>>> Handle(GetPayheadsListQuery request, CancellationToken cancellationToken)
    {
        var items = _componentRepository.GetQueryable()
            .Select(c => new PayheadDto
            {
                Id = c.Id,
                Name = c.Name,
                Code = c.Code,
                Type = c.Type,
                CalculationType = c.CalculationType,
                DefaultValue = c.DefaultValue,
                IsTaxable = c.IsTaxable
            })
            .ToList();

        return Task.FromResult(ApiResponse<IReadOnlyList<PayheadDto>>.Success(items, "Payheads list retrieved successfully."));
    }
}

/// <summary>
/// Command to create a salary payhead.
/// </summary>
public record CreatePayheadCommand(
    int SalaryStructureId,
    string Name,
    string Code,
    ComponentType Type,
    CalculationType CalculationType,
    decimal DefaultValue,
    bool IsTaxable = true) : IRequest<ApiResponse<PayheadDto>>;

/// <summary>
/// Validator for <see cref="CreatePayheadCommand"/>.
/// </summary>
public class CreatePayheadCommandValidator : AbstractValidator<CreatePayheadCommand>
{
    /// <summary>
    /// Initializes validation rules for CreatePayheadCommand.
    /// </summary>
    public CreatePayheadCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Payhead name is required.");
        RuleFor(x => x.Code).NotEmpty().WithMessage("Payhead code is required.");
    }
}

/// <summary>
/// Handler for <see cref="CreatePayheadCommand"/>.
/// </summary>
public class CreatePayheadCommandHandler : IRequestHandler<CreatePayheadCommand, ApiResponse<PayheadDto>>
{
    private readonly IGenericRepository<SalaryComponent> _componentRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreatePayheadCommandHandler"/> class.
    /// </summary>
    public CreatePayheadCommandHandler(
        IGenericRepository<SalaryComponent> componentRepository,
        IUnitOfWork unitOfWork)
    {
        _componentRepository = componentRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes payhead creation.
    /// </summary>
    public async Task<ApiResponse<PayheadDto>> Handle(CreatePayheadCommand request, CancellationToken cancellationToken)
    {
        var comp = SalaryComponent.Create(
            request.SalaryStructureId,
            request.Name,
            request.Code,
            request.Type,
            request.CalculationType,
            request.DefaultValue,
            request.IsTaxable);

        await _componentRepository.AddAsync(comp, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = new PayheadDto
        {
            Id = comp.Id,
            Name = comp.Name,
            Code = comp.Code,
            Type = comp.Type,
            CalculationType = comp.CalculationType,
            DefaultValue = comp.DefaultValue,
            IsTaxable = comp.IsTaxable
        };

        return ApiResponse<PayheadDto>.Success(dto, "Salary payhead created successfully.");
    }
}

/// <summary>
/// Command to update an existing salary payhead / component.
/// </summary>
public record UpdatePayheadCommand(
    int Id,
    string Name,
    string Code,
    ComponentType Type,
    CalculationType CalculationType,
    decimal DefaultValue,
    bool IsTaxable = true) : IRequest<ApiResponse<PayheadDto>>;

/// <summary>
/// Validator for <see cref="UpdatePayheadCommand"/>.
/// </summary>
public class UpdatePayheadCommandValidator : AbstractValidator<UpdatePayheadCommand>
{
    /// <summary>
    /// Initializes validation rules for UpdatePayheadCommand.
    /// </summary>
    public UpdatePayheadCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid payhead ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Payhead name is required.");
        RuleFor(x => x.Code).NotEmpty().WithMessage("Payhead code is required.");
    }
}

/// <summary>
/// Handler for <see cref="UpdatePayheadCommand"/>.
/// </summary>
public class UpdatePayheadCommandHandler : IRequestHandler<UpdatePayheadCommand, ApiResponse<PayheadDto>>
{
    private readonly IGenericRepository<SalaryComponent> _componentRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdatePayheadCommandHandler"/> class.
    /// </summary>
    public UpdatePayheadCommandHandler(
        IGenericRepository<SalaryComponent> componentRepository,
        IUnitOfWork unitOfWork)
    {
        _componentRepository = componentRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes payhead update.
    /// </summary>
    public async Task<ApiResponse<PayheadDto>> Handle(UpdatePayheadCommand request, CancellationToken cancellationToken)
    {
        var comp = await _componentRepository.GetByIdAsync(request.Id, cancellationToken);
        if (comp == null)
        {
            return ApiResponse<PayheadDto>.Fail("Salary payhead not found.");
        }

        comp.Update(
            request.Name,
            request.Code,
            request.Type,
            request.CalculationType,
            request.DefaultValue,
            request.IsTaxable);

        _componentRepository.Update(comp);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = new PayheadDto
        {
            Id = comp.Id,
            Name = comp.Name,
            Code = comp.Code,
            Type = comp.Type,
            CalculationType = comp.CalculationType,
            DefaultValue = comp.DefaultValue,
            IsTaxable = comp.IsTaxable
        };

        return ApiResponse<PayheadDto>.Success(dto, "Salary payhead updated successfully.");
    }
}

