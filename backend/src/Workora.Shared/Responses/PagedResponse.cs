namespace Workora.Shared.Responses;

/// <summary>
/// A standardized wrapper for paginated API responses.
/// </summary>
/// <typeparam name="T">The type of the paginated items.</typeparam>
public class PagedResponse<T>
{
    /// <summary>
    /// Gets the collection of items for the current page.
    /// </summary>
    public IReadOnlyList<T> Items { get; init; } = [];

    /// <summary>
    /// Gets the 1-based page number.
    /// </summary>
    public int PageNumber { get; init; }

    /// <summary>
    /// Gets the number of items requested per page.
    /// </summary>
    public int PageSize { get; init; }

    /// <summary>
    /// Gets the total number of items available across all pages.
    /// </summary>
    public int TotalCount { get; init; }

    /// <summary>
    /// Gets the total number of pages available.
    /// </summary>
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
