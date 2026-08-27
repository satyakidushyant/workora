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
