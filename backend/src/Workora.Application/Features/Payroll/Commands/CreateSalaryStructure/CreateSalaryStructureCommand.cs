using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.CreateSalaryStructure;

/// <summary>
/// Command to create a salary structure with itemized components.
/// </summary>
public record CreateSalaryStructureCommand(
    int CompanyId,
    string Name,
    string? Description,
    IReadOnlyList<CreateSalaryComponentDto> Components) : IRequest<ApiResponse<SalaryStructureDto>>;

/// <summary>
/// Validator for <see cref="CreateSalaryStructureCommand"/>.
/// </summary>
public class CreateSalaryStructureCommandValidator : AbstractValidator<CreateSalaryStructureCommand>
{
    /// <summary>
    /// Initializes validation rules for salary structure creation.
    /// </summary>
    public CreateSalaryStructureCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150).WithMessage("Structure name is required.");
        RuleFor(x => x.Components).NotEmpty().WithMessage("At least one salary component is required.");
    }
}

/// <summary>
/// Handler for <see cref="CreateSalaryStructureCommand"/>.
/// </summary>
public class CreateSalaryStructureCommandHandler : IRequestHandler<CreateSalaryStructureCommand, ApiResponse<SalaryStructureDto>>
{
    private readonly ISalaryStructureRepository _salaryStructureRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateSalaryStructureCommandHandler"/> class.
    /// </summary>
    public CreateSalaryStructureCommandHandler(
        ISalaryStructureRepository salaryStructureRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _salaryStructureRepository = salaryStructureRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<SalaryStructureDto>> Handle(CreateSalaryStructureCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<SalaryStructureDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var structure = SalaryStructure.Create(request.CompanyId, request.Name, request.Description);

        foreach (var comp in request.Components)
        {
            var componentEntity = SalaryComponent.Create(
                0,
                comp.Name,
                comp.Code,
                comp.Type,
                comp.CalculationType,
                comp.DefaultValue,
                comp.IsTaxable);

            structure.AddComponent(componentEntity);
        }

        await _salaryStructureRepository.AddAsync(structure, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var loaded = await _salaryStructureRepository.GetWithComponentsAsync(structure.Id, ct);
        var dto = _mapper.Map<SalaryStructureDto>(loaded ?? structure);
        return ApiResponse<SalaryStructureDto>.Success(dto, ResponseMessage.SalaryStructureCreated.GetDescription());
    }
}
