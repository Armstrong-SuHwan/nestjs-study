import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { BatchModule } from './batch/batch.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { HttpModule } from '@nestjs/axios';
import { DogHealthIndicator } from './health-check/dog.health';

@Module({
  imports: [BatchModule, TerminusModule, HttpModule],
  providers: [DogHealthIndicator],
  controllers: [HealthCheckController],
})
export class AppModule { }
