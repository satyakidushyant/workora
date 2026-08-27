using AutoMapper;
using MediatR;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Queries.GetDesignationById;

/// <summary>
/// Query to retrieve a designation by ID.
/// </summary>
public record GetDesignationByIdQuery(int Id) : IRequest<ApiResponse<DesignationDto>>;
