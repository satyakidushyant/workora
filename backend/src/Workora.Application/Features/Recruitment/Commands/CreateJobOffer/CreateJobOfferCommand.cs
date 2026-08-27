using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.CreateJobOffer;

/// <summary>
/// Command to generate a job offer for a candidate.
/// </summary>
public record CreateJobOfferCommand(
    int CandidateId,
    decimal OfferedSalary,
    DateOnly JoiningDate,
    DateOnly ExpiryDate,
    string? Notes) : IRequest<ApiResponse<JobOfferDto>>;
