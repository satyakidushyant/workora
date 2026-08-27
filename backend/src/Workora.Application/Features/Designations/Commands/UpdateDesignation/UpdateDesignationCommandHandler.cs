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
            return ApiResponse<DesignationDto>.Fail(ResponseMessage.DesignationTitleAlreadyExists.GetDescription());
        }

        designation.Update(request.DepartmentId, request.Title, request.Level, request.Grade, request.Description);
        _designationRepository.Update(designation);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<DesignationDto>(designation);
        return ApiResponse<DesignationDto>.Success(dto, ResponseMessage.DesignationUpdated.GetDescription());
    }
}
