namespace Workora.Application.Common.Models;

/// <summary>
/// Base record for paginated and searchable query requests with dynamic parameters.
/// </summary>
public record PagedQueryBase
{
    private readonly int _pageNumber = DefaultPageNumber;
    private readonly int _pageSize = DefaultPageSize;

    /// <summary>
    /// Default page number if not specified or invalid.
    /// </summary>
    public const int DefaultPageNumber = 1;

    /// <summary>
    /// Default page size if not specified or invalid.
    /// </summary>
    public const int DefaultPageSize = 10;

    /// <summary>
    /// Maximum allowed page size to prevent excessive database payload.
    /// </summary>
    public const int MaxPageSize = 100;

    /// <summary>
    /// Gets or init the 1-based page number. Defaults to 1.
    /// </summary>
    public int PageNumber
    {
        get => _pageNumber <= 0 ? DefaultPageNumber : _pageNumber;
        init => _pageNumber = value <= 0 ? DefaultPageNumber : value;
    }

    /// <summary>
    /// Gets or init the page size. Defaults to 10, clamped to a maximum of 100.
    /// </summary>
    public int PageSize
    {
        get => _pageSize <= 0 ? DefaultPageSize : (_pageSize > MaxPageSize ? MaxPageSize : _pageSize);
        init => _pageSize = value <= 0 ? DefaultPageSize : (value > MaxPageSize ? MaxPageSize : value);
    }

    /// <summary>
    /// Gets or init optional search term for filtering.
    /// </summary>
    public string? SearchTerm { get; init; }

    /// <summary>
    /// Gets or init optional field name to sort by.
    /// </summary>
    public string? SortBy { get; init; }

    /// <summary>
    /// Gets or init value indicating whether sorting direction is descending (default: false / ascending).
    /// </summary>
    public bool IsDescending { get; init; } = false;
}
