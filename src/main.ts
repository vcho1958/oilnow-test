import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/uncaught-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'error', 'warn'],
    bufferLogs: true,
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(8080);
}
bootstrap();
