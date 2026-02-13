// runtime (server-only)
export {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from './errors'

export { handleApiError } from './error-handler'

// types (safe everywhere)
export type {
  ErrorResponse,
  SuccessResponse,
  ApiResponse,
  ErrorCode,
} from './types'

export { ERROR_CODES } from './types'
