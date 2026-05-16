/**
 * Custom Error class for consistent error responses
 */
class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    
    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;
