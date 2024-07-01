import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfoInterface } from './interface/user-info.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // @Inject(UsersService) private readonly usersService: UsersService;

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfoInterface> {
    return await this.usersService.getUserInfo(userId);
  }

  @Get()
  async getAllUserInfo(): Promise<UserInfoInterface> {
    console.log('Getting all user info but it is not implemented yet');
    return;
  }
}
