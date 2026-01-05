import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AnalysisModule } from './analysis/analysis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OpenAIModule } from './openai/openai.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
      ignoreEnvFile: process.env.NODE_ENV === 'test', // In CI/test, use environment variables directly
    }),
    PrismaModule, // Global database module
    AuthModule,
    OpenAIModule,
    AnalysisModule,
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
