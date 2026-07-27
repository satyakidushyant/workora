/**
 * Field-level validation error structure returned by the API envelope.
 */
export interface FieldError {
  /**
   * Target property/field name causing the validation error.
   */
  field: string;

  /**
   * Human-readable validation error message.
   */
  message: string;
}

/**
 * Standardized API response wrapper matching the backend `ApiResponse<T>`.
 *
 * @template T Payload data type.
 */
export interface ApiResponse<T> {
  /**
   * Indicates whether the request was successful.
   */
  isSuccess: boolean;

  /**
   * Data payload returned when `isSuccess` is true.
   */
  data?: T | null;

  /**
   * Message describing outcome or error detail when `isSuccess` is false.
   */
  message?: string | null;

  /**
   * List of field validation errors if request validation failed.
   */
  errors?: FieldError[] | null;

  /**
   * Unique correlation ID associated with the HTTP request.
   */
  correlationId?: string | null;
}

/**
 * Standardized paginated API response wrapper matching the backend `PagedResponse<T>`.
 *
 * @template T Item entity type inside the page.
 */
export interface PagedResponse<T> {
  /**
   * List of items on the current page.
   */
  items: T[];

  /**
   * Total number of pages available.
   */
  totalPages: number;

  /**
   * Total item count across all pages.
   */
  totalCount: number;

  /**
   * Current 1-based page index.
   */
  pageIndex: number;

  /**
   * Number of items per page.
   */
  pageSize: number;

  /**
   * Indicates if there is a previous page.
   */
  hasPreviousPage: boolean;

  /**
   * Indicates if there is a next page.
   */
  hasNextPage: boolean;
}
