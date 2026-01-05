import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService for environment variables
  const configService = app.get(ConfigService);

  // Enable CORS
  const corsOrigins = configService.get('CORS_ORIGINS', 'http://localhost:4001');
  app.enableCors({
    origin: corsOrigins.split(',').map((origin: string) => origin.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api/v1');
  await app.listen(4000);
  console.log('Backend running on http://localhost:4000');
  console.log(`CORS enabled for origins: ${corsOrigins}`);
}
void bootstrap();
