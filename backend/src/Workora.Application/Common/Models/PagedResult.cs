namespace Workora.Application.Common.Models;

/// <summary>
/// Represents a paginated query result from the application layer.
/// </summary>
/// <typeparam name="T">The type of the paginated items.</typeparam>
public class PagedResult<T>
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
    /// Initializes a new instance of the <see cref="PagedResult{T}"/> class.
    /// </summary>
    /// <param name="items">The items on the current page.</param>
    /// <param name="totalCount">The total count of all items.</param>
    /// <param name="pageNumber">The current page number.</param>
    /// <param name="pageSize">The number of items per page.</param>
    public PagedResult(IReadOnlyList<T> items, int totalCount, int pageNumber, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        PageNumber = pageNumber;
        PageSize = pageSize;
    }
}
