import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as compression from 'compression';
import {
  configureCors,
  configureGlobalFilters,
  configureGlobalInterceptors,
  configureGlobalPipes,
  configureSwagger,
} from './server-config.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  await app.listen(process.env.PORT ?? 3000);
}

function configureApp(app: INestApplication) {
  configureCors(app);
  configureSwagger(app);
  configureGlobalPipes(app);
  configureGlobalFilters(app);
  configureGlobalInterceptors(app);
  app.setGlobalPrefix('api');
  app.use(compression());
}
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Error during application bootstrap:', error.stack);
});
