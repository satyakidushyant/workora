using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.DTOs;

/// <summary>
/// DTO representing an appraisal performance review.
/// </summary>
public record AppraisalDto(
    int Id,
    Guid Uuid,
    int EmployeeId,
    string? EmployeeName,
    string? EmployeeCode,
    int ReviewerEmployeeId,
    string? ReviewerName,
    string Period,
    int Year,
    AppraisalStatus Status,
    string? SelfReviewComments,
    int? SelfReviewRating,
    string? ManagerReviewComments,
    int? ManagerReviewRating,
    decimal? FinalScore,
    bool IsActive,
    DateTimeOffset CreatedAt);
