using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.UpdatePayhead;

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
