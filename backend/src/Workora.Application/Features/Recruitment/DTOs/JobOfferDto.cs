using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// DTO representing an employment job offer.
/// </summary>
public record JobOfferDto(
    int Id,
    Guid Uuid,
    int CandidateId,
    string? CandidateName,
    decimal OfferedSalary,
    DateOnly JoiningDate,
    DateOnly ExpiryDate,
    OfferStatus Status,
    DateTimeOffset? SentAt,
    DateTimeOffset? RespondedAt,
    string? Notes);
