import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerForUserMiddleware } from './logger/loggerForUser.middleware';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      synchronize: false,
      migrationsRun: false,
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations',
      verboseRetryLog: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware, LoggerForUserMiddleware)
      .exclude({ path: 'users', method: RequestMethod.GET })
      .forRoutes(UsersController);
  }
}
