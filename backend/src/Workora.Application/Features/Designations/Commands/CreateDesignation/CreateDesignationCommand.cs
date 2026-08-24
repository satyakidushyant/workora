using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Commands.CreateDesignation;

/// <summary>
/// Command to create a new designation / job title.
/// </summary>
public record CreateDesignationCommand(
    int DepartmentId,
    string Title,
    int Level,
    string? Grade,
    string? Description) : IRequest<ApiResponse<DesignationDto>>;

/// <summary>
/// Validator for <see cref="CreateDesignationCommand"/>.
/// </summary>
public class CreateDesignationCommandValidator : AbstractValidator<CreateDesignationCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CreateDesignationCommand"/>.
    /// </summary>
    public CreateDesignationCommandValidator()
    {
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.Level).GreaterThan(0).WithMessage("Level must be greater than 0.");
    }
}

/// <summary>
/// Handler for <see cref="CreateDesignationCommand"/>.
/// </summary>
public class CreateDesignationCommandHandler : IRequestHandler<CreateDesignationCommand, ApiResponse<DesignationDto>>
{
    private readonly IDesignationRepository _designationRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateDesignationCommandHandler"/> class.
    /// </summary>
    public CreateDesignationCommandHandler(
        IDesignationRepository designationRepository,
        IDepartmentRepository departmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _designationRepository = designationRepository;
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DesignationDto>> Handle(CreateDesignationCommand request, CancellationToken ct)
    {
        var department = await _departmentRepository.GetByIdAsync(request.DepartmentId, ct);
        if (department == null)
        {
            return ApiResponse<DesignationDto>.Fail(ResponseMessage.DepartmentNotFound.GetDescription());
        }

        var isUnique = await _designationRepository.IsTitleUniqueAsync(request.DepartmentId, request.Title, null, ct);
        if (!isUnique)
        {
            return ApiResponse<DesignationDto>.Fail("A designation with this title already exists in the department.");
        }

        var designation = Designation.Create(
            request.DepartmentId,
            request.Title,
            request.Level,
            request.Grade,
            request.Description);

        await _designationRepository.AddAsync(designation, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<DesignationDto>(designation);
        return ApiResponse<DesignationDto>.Success(dto, ResponseMessage.DesignationCreated.GetDescription());
    }
}
