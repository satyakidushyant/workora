using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayheadsList;

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

        return Task.FromResult(ApiResponse<IReadOnlyList<PayheadDto>>.Success(items, ResponseMessage.PayheadsRetrieved.GetDescription()));
    }
}
