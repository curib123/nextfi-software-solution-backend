import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const prismaService = app.get(PrismaService);

  prismaService.enableShutdownHooks(app);

  app.setGlobalPrefix(configService.getOrThrow<string>('app.apiPrefix'));
  app.enableCors({
    origin: configService.getOrThrow<string>('app.frontendUrl'),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor(reflector));

  await app.listen(configService.getOrThrow<number>('app.port'));
}

void bootstrap();
