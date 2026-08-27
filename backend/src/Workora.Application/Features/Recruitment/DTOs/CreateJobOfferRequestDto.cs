using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// Request payload for generating a job offer.
/// </summary>
public record CreateJobOfferRequestDto(
    int CandidateId,
    decimal OfferedSalary,
    DateOnly JoiningDate,
    DateOnly ExpiryDate,
    string? Notes);
