using AutoMapper;
using MediatR;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.Queries.GetEmployeeVisitHistory;

/// <summary>
/// Query to get client visit history for an employee within a date window.
/// </summary>
public record GetEmployeeVisitHistoryQuery(int EmployeeId, DateOnly? FromDate, DateOnly? ToDate) : IRequest<ApiResponse<List<FieldVisitDto>>>;
