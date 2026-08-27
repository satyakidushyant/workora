using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.UpdateSalaryStructure;

/// <summary>
/// Handler for <see cref="UpdateSalaryStructureCommand"/>.
/// </summary>
public class UpdateSalaryStructureCommandHandler : IRequestHandler<UpdateSalaryStructureCommand, ApiResponse<SalaryStructureDto>>
{
    private readonly ISalaryStructureRepository _salaryStructureRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateSalaryStructureCommandHandler"/> class.
    /// </summary>
    public UpdateSalaryStructureCommandHandler(
        ISalaryStructureRepository salaryStructureRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _salaryStructureRepository = salaryStructureRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<SalaryStructureDto>> Handle(UpdateSalaryStructureCommand request, CancellationToken ct)
    {
        var structure = await _salaryStructureRepository.GetWithComponentsAsync(request.Id, ct);
        if (structure == null)
        {
            return ApiResponse<SalaryStructureDto>.Fail(ResponseMessage.SalaryStructureNotFound.GetDescription());
        }

        structure.Update(request.Name, request.Description);

        var newComponents = request.Components.Select(comp => SalaryComponent.Create(
            structure.Id,
            comp.Name,
            comp.Code,
            comp.Type,
            comp.CalculationType,
            comp.DefaultValue,
            comp.IsTaxable
        )).ToList();

        structure.SetComponents(newComponents);

        _salaryStructureRepository.Update(structure);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<SalaryStructureDto>(structure);
        return ApiResponse<SalaryStructureDto>.Success(dto, ResponseMessage.SalaryStructureUpdated.GetDescription());
    }
}
