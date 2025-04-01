import { ApiProperty } from '@nestjs/swagger';

export class HttpResponse<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  errors?: Record<string, string[]>;

  constructor(
    success: boolean,
    message: string,
    data?: T,
    errors?: Record<string, string[]>,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success<T>(data?: T, message: string = 'Success'): HttpResponse<T> {
    return new HttpResponse<T>(true, message, data);
  }

  static error<T>(
    message: string = 'Error',
    errors?: Record<string, string[]>,
    data?: T,
  ): HttpResponse<T> {
    return new HttpResponse<T>(false, message, data, errors);
  }
}
