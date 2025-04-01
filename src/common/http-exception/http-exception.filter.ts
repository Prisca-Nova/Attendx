import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';
import { EntityNotFoundError } from 'typeorm';
import { HttpResponse } from '../dto/http-response';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.error(exception);
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      // Handle validation errors
      if (
        statusCode === HttpStatus.BAD_REQUEST &&
        Array.isArray(exceptionResponse?.message)
      ) {
        const validationErrors: Record<string, string[]> = {};

        const processValidationErrors = (
          errors: ValidationError[],
          prefix = '',
        ) => {
          errors.forEach((error: ValidationError) => {
            const property = prefix
              ? `${prefix}.${error.property}`
              : error.property;
            if (error.constraints) {
              validationErrors[property] = Object.values(error.constraints);
            }
            if (error.children && error.children.length > 0) {
              processValidationErrors(error.children, property);
            }
          });
        };

        processValidationErrors(exceptionResponse.message);

        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(HttpResponse.error('Validation failed', validationErrors));
      }

      // Handle other HTTP exceptions
      return response
        .status(statusCode)
        .json(
          HttpResponse.error(
            typeof exceptionResponse === 'string'
              ? exceptionResponse
              : exceptionResponse.message,
          ),
        );
    }
    if (exception instanceof EntityNotFoundError) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json(HttpResponse.error('Entity not found'));
    }

    // Handle unknown errors
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(HttpResponse.error('Internal server error'));
  }
}
