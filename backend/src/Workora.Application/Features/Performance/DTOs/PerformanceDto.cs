using Workora.Domain.Enums;

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

/// <summary>
/// DTO representing an employee KPI / Goal.
/// </summary>
public record GoalDto(
    int Id,
    Guid Uuid,
    int EmployeeId,
    string? EmployeeName,
    string Title,
    string Description,
    DateOnly TargetDate,
    int ProgressPercentage,
    GoalStatus Status,
    bool IsActive,
    DateTimeOffset CreatedAt);

/// <summary>
/// Request payload for creating an appraisal cycle.
/// </summary>
public record CreateAppraisalRequestDto(
    int EmployeeId,
    int ReviewerEmployeeId,
    string Period,
    int Year);

/// <summary>
/// Request payload for submitting self review.
/// </summary>
public record SubmitSelfReviewRequestDto(
    string Comments,
    int Rating);

/// <summary>
/// Request payload for submitting manager evaluation.
/// </summary>
public record SubmitManagerReviewRequestDto(
    string Comments,
    int Rating);

/// <summary>
/// Request payload for finalizing an appraisal.
/// </summary>
public record FinalizeAppraisalRequestDto(
    decimal FinalScore);

/// <summary>
/// Request payload for creating a goal.
/// </summary>
public record CreateGoalRequestDto(
    int EmployeeId,
    string Title,
    string Description,
    DateOnly TargetDate);

/// <summary>
/// Request payload for updating goal progress.
/// </summary>
public record UpdateGoalProgressRequestDto(
    int ProgressPercentage,
    GoalStatus Status);
