using AutoMapper;
using MediatR;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Queries.GetShiftById;

/// <summary>
/// Query to retrieve a shift by ID.
/// </summary>
public record GetShiftByIdQuery(int Id) : IRequest<ApiResponse<ShiftDto>>;
