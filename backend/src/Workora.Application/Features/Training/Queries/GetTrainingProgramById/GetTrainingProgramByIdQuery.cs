using AutoMapper;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Queries.GetTrainingProgramById;

/// <summary>
/// Query to retrieve a training program by ID.
/// </summary>
public record GetTrainingProgramByIdQuery(int Id) : IRequest<ApiResponse<TrainingProgramDto>>;
