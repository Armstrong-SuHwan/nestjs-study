import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { UsersModule } from './users/users.module';
import { ExceptionModule } from './exception/exception.modules';

@Module({
  imports: [UsersModule, ExceptionModule],
  controllers: [AppController],
  providers: [
    AppService,
    // Logger,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule {}
