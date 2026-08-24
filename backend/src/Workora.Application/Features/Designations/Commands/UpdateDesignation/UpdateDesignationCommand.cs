using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Commands.UpdateDesignation;

/// <summary>
/// Command to update an existing designation.
/// </summary>
public record UpdateDesignationCommand(
    int Id,
    int DepartmentId,
    string Title,
    int Level,
    string? Grade,
    string? Description) : IRequest<ApiResponse<DesignationDto>>;

/// <summary>
/// Validator for <see cref="UpdateDesignationCommand"/>.
/// </summary>
public class UpdateDesignationCommandValidator : AbstractValidator<UpdateDesignationCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UpdateDesignationCommand"/>.
    /// </summary>
    public UpdateDesignationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid designation ID is required.");
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.Level).GreaterThan(0).WithMessage("Level must be greater than 0.");
    }
}

/// <summary>
/// Handler for <see cref="UpdateDesignationCommand"/>.
/// </summary>
public class UpdateDesignationCommandHandler : IRequestHandler<UpdateDesignationCommand, ApiResponse<DesignationDto>>
{
    private readonly IDesignationRepository _designationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateDesignationCommandHandler"/> class.
    /// </summary>
    public UpdateDesignationCommandHandler(
        IDesignationRepository designationRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _designationRepository = designationRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DesignationDto>> Handle(UpdateDesignationCommand request, CancellationToken ct)
    {
        var designation = await _designationRepository.GetByIdAsync(request.Id, ct);
        if (designation == null)
        {
            return ApiResponse<DesignationDto>.Fail(ResponseMessage.DesignationNotFound.GetDescription());
        }

        var isUnique = await _designationRepository.IsTitleUniqueAsync(request.DepartmentId, request.Title, request.Id, ct);
        if (!isUnique)
        {
            return ApiResponse<DesignationDto>.Fail("A designation with this title already exists in the department.");
        }

        designation.Update(request.DepartmentId, request.Title, request.Level, request.Grade, request.Description);
        _designationRepository.Update(designation);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<DesignationDto>(designation);
        return ApiResponse<DesignationDto>.Success(dto, ResponseMessage.DesignationUpdated.GetDescription());
    }
}
