namespace Workora.Shared.Responses;

public class ApiResponse<T>
{
    public bool IsSuccess { get; init; }
    public T? Data { get; init; }
    public string? Message { get; init; }
    public List<FieldError>? Errors { get; init; }
    public string? CorrelationId { get; init; }

    /// <summary>
    /// Creates a successful API response.
    /// </summary>
    public static ApiResponse<T> Success(T data, string? message = null) => new() { IsSuccess = true, Data = data, Message = message };

    /// <summary>
    /// Creates a failed API response.
    /// </summary>
    public static ApiResponse<T> Fail(string message, List<FieldError>? errors = null) =>
        new() { IsSuccess = false, Message = message, Errors = errors };
}
