import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { SamplesModule } from './samples/samples.module';
import {
  OpenApiController,
  OpenApiWithVersionController,
} from './open-api/open-api.controller';

@Module({
  imports: [UsersModule, SamplesModule],
  controllers: [OpenApiWithVersionController, OpenApiController, AppController],
  providers: [],
})
export class AppModule {}
