using AutoMapper;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Queries.GetLeaveTypesList;

/// <summary>
/// Query to list all configured leave types.
/// </summary>
public record GetLeaveTypesListQuery(int? CompanyId = null) : IRequest<ApiResponse<IReadOnlyList<LeaveTypeDto>>>;
