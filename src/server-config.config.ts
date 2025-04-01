import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/http-exception/http-exception.filter';
import { Reflector } from '@nestjs/core';

export function configureCors(app: INestApplication) {
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    methods: process.env.ALLOWED_METHODS?.split(',') || [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'OPTIONS',
    ],
    allowedHeaders: process.env.ALLOWED_HEADERS?.split(',') || [
      'Content-Type',
      'Authorization',
    ],
    credentials: process.env.ALLOW_CREDENTIALS === 'true',
    maxAge: parseInt(process.env.CORS_MAX_AGE || '3600'),
  });
}

export function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Attent X')
    .setDescription('Attent X')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);
}

export function configureGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const formattedErrors: Record<string, string[]> = {};
        errors.forEach((error) => {
          formattedErrors[error.property] = Object.values(
            error.constraints || {},
          );
        });
        return new BadRequestException(errors);
      },
    }),
  );
}

export function configureGlobalFilters(app: INestApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
}

export function configureGlobalInterceptors(app: INestApplication) {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}
