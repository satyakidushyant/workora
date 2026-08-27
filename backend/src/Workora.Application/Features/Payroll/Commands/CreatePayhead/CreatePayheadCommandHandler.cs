using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.CreatePayhead;

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

        return ApiResponse<PayheadDto>.Success(dto, ResponseMessage.PayheadCreated.GetDescription());
    }
}
