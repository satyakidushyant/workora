using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Commands.CreateDesignation;

/// <summary>
/// Command to create a new designation / job title.
/// </summary>
public record CreateDesignationCommand(
    int DepartmentId,
    string Title,
    int Level,
    string? Grade,
    string? Description) : IRequest<ApiResponse<DesignationDto>>;
