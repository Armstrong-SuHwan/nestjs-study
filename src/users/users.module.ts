import { Module } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
})
export class UsersModule {}
