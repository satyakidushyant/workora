/**
 * DTO representing field validation error details returned by backend envelope.
 */
export interface FieldErrorDto {
  /**
   * Target field name.
   */
  field: string;

  /**
   * Validation message.
   */
  message: string;
}

/**
 * DTO matching backend `ApiResponse<T>` envelope response structure.
 *
 * @template T Payload data type.
 */
export interface ApiResponseDto<T> {
  /**
   * Indicates whether request completed successfully.
   */
  isSuccess: boolean;

  /**
   * Payload payload object returned when successful.
   */
  data?: T | null;

  /**
   * Message detail returned when unsuccessful or informative.
   */
  message?: string | null;

  /**
   * List of field validation errors.
   */
  errors?: FieldErrorDto[] | null;

  /**
   * Unique request tracking ID.
   */
  correlationId?: string | null;
}
