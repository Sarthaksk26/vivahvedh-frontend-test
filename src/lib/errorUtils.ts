import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types';

/**
 * Extracts a human-readable error message from an Axios error,
 * handling both string errors and arrays of error objects (like Zod validation errors).
 */
export function formatApiError(err: unknown, fallback = 'An unexpected error occurred'): string {
  const axiosError = err as AxiosError<ApiErrorResponse>;
  const errorData = axiosError.response?.data?.error;

  if (!errorData) return fallback;

  if (typeof errorData === 'string') {
    return errorData;
  }

  if (Array.isArray(errorData)) {
    return errorData.map((e: any) => e.message).join(', ');
  }

  return fallback;
}
