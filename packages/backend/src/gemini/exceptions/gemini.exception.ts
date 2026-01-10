import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base exception for all Gemini-related errors.
 *
 * This exception should be used for general Gemini errors that don't fit
 * into more specific categories (rate limits, authentication, etc.)
 */
export class GeminiException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status);
    this.name = 'GeminiException';
  }
}

/**
 * Exception thrown when Gemini API key is invalid or not configured.
 *
 * HTTP Status: 401 Unauthorized
 */
export class GeminiAuthenticationException extends GeminiException {
  constructor(message: string = 'Invalid Gemini API key configuration') {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = 'GeminiAuthenticationException';
  }
}

/**
 * Exception thrown when Gemini rate limit is exceeded.
 *
 * HTTP Status: 429 Too Many Requests
 */
export class GeminiRateLimitException extends GeminiException {
  constructor(message: string = 'Gemini rate limit exceeded. Please try again in a moment.') {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
    this.name = 'GeminiRateLimitException';
  }
}

/**
 * Exception thrown when Gemini service is unavailable or returns a server error.
 *
 * HTTP Status: 503 Service Unavailable
 */
export class GeminiServiceException extends GeminiException {
  constructor(message: string = 'Gemini service is temporarily unavailable. Please try again.') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
    this.name = 'GeminiServiceException';
  }
}

/**
 * Exception thrown when the Gemini API key is not configured or is a placeholder.
 *
 * HTTP Status: 500 Internal Server Error
 */
export class GeminiConfigurationException extends GeminiException {
  constructor(message: string = 'Gemini API is not properly configured') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = 'GeminiConfigurationException';
  }
}

/**
 * Exception thrown when circuit breaker is open due to sustained failures.
 *
 * HTTP Status: 503 Service Unavailable
 */
export class GeminiCircuitBreakerException extends GeminiException {
  constructor(
    message: string = 'Gemini service is temporarily unavailable due to repeated failures'
  ) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
    this.name = 'GeminiCircuitBreakerException';
  }
}
