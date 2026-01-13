/**
 * Custom error classes for OpenAsset SDK
 */

/**
 * Base error class for OpenAsset API errors
 */
export class OpenAssetError extends Error {
  public readonly statusCode?: number;
  public readonly response?: unknown;

  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message);
    this.name = 'OpenAssetError';
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, OpenAssetError.prototype);
  }
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends OpenAssetError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Error thrown when access is forbidden
 */
export class ForbiddenError extends OpenAssetError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends OpenAssetError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error thrown when the HTTP method is not allowed
 */
export class MethodNotAllowedError extends OpenAssetError {
  constructor(message: string = 'Method not allowed') {
    super(message, 405);
    this.name = 'MethodNotAllowedError';
    Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
  }
}

/**
 * Error thrown when there's a conflict (e.g., duplicate resource)
 */
export class ConflictError extends OpenAssetError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Error thrown when the request is valid but cannot be processed
 */
export class UnprocessableEntityError extends OpenAssetError {
  constructor(message: string = 'Unprocessable entity') {
    super(message, 422);
    this.name = 'UnprocessableEntityError';
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}

/**
 * Error thrown for bad requests
 */
export class BadRequestError extends OpenAssetError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * Error thrown for server errors
 */
export class ServerError extends OpenAssetError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Map HTTP status codes to error classes
 */
export function createErrorFromStatus(
  statusCode: number,
  message: string,
  response?: unknown
): OpenAssetError {
  switch (statusCode) {
    case 400:
      return new BadRequestError(message);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new ForbiddenError(message);
    case 404:
      return new NotFoundError(message);
    case 405:
      return new MethodNotAllowedError(message);
    case 409:
      return new ConflictError(message);
    case 422:
      return new UnprocessableEntityError(message);
    case 500:
      return new ServerError(message);
    default:
      return new OpenAssetError(message, statusCode, response);
  }
}
