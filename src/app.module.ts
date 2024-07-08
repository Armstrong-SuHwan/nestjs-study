import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UsersController } from './users/users.controller';
// import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
// import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    ConfigModule.forRoot({
      // envFilePath:
        // process.env.NODE_ENV === 'production'
        //   ? '.production.env'
        //   : process.env.NODE_ENV === 'stage'
        //     ? '.stage.env'
        //     : '.development.env',
        
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
