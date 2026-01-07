import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base exception for all OpenAI-related errors.
 *
 * This exception should be used for general OpenAI errors that don't fit
 * into more specific categories (rate limits, authentication, etc.)
 */
export class OpenAIException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status);
    this.name = 'OpenAIException';
  }
}

/**
 * Exception thrown when OpenAI API key is invalid or not configured.
 *
 * HTTP Status: 401 Unauthorized
 */
export class OpenAIAuthenticationException extends OpenAIException {
  constructor(message: string = 'Invalid OpenAI API key configuration') {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = 'OpenAIAuthenticationException';
  }
}

/**
 * Exception thrown when OpenAI rate limit is exceeded.
 *
 * HTTP Status: 429 Too Many Requests
 */
export class OpenAIRateLimitException extends OpenAIException {
  constructor(message: string = 'OpenAI rate limit exceeded. Please try again in a moment.') {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
    this.name = 'OpenAIRateLimitException';
  }
}

/**
 * Exception thrown when OpenAI service is unavailable or returns a server error.
 *
 * HTTP Status: 503 Service Unavailable
 */
export class OpenAIServiceException extends OpenAIException {
  constructor(message: string = 'OpenAI service is temporarily unavailable. Please try again.') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
    this.name = 'OpenAIServiceException';
  }
}

/**
 * Exception thrown when the OpenAI API key is not configured or is a placeholder.
 *
 * HTTP Status: 500 Internal Server Error
 */
export class OpenAIConfigurationException extends OpenAIException {
  constructor(message: string = 'OpenAI API is not properly configured') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = 'OpenAIConfigurationException';
  }
}

/**
 * Exception thrown when circuit breaker is open due to sustained failures.
 *
 * HTTP Status: 503 Service Unavailable
 */
export class OpenAICircuitBreakerException extends OpenAIException {
  constructor(
    message: string = 'OpenAI service is temporarily unavailable due to repeated failures'
  ) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
    this.name = 'OpenAICircuitBreakerException';
  }
}
