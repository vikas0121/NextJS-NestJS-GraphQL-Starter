import { ENV } from '@constants';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
// import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // app.use(helmet());

  // Sentry.init({
  //   dsn: SENTRY_DSN,
  //   environment: ENV,
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  );
  Logger.log(`Starting server in ${ENV} mode`);
  await app.listen(5000);
}
bootstrap();
