import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, LoggerService, InternalServerErrorException, Logger } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/create-user.command';
// import { VerifyEmailCommand } from './command/verify-email.command';
// import { LoginCommand } from './command/login.command';
import { UserInfo } from './UserInfo';
import { GetUserInfoQuery } from './query/get-user-info.query';

@Controller('users')
// @UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    //@Inject(Logger) private readonly logger: LoggerService,
  ) { }
  // constructor(private readonly usersService: UsersService) {}

  // @UseFilters(HttpExceptionFilter)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {

    const { name, email, password } = createUserDto;

    console.log( name, email, password);

    const command = new CreateUserCommand(name, email, password);

    console.log( command);

    return this.commandBus.execute(command);

    //return this.usersService.create(createUserDto);
  }

  // @Post('/email-verify')
  // async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
  //   const { signupVerifyToken } = dto;

  //   const command = new VerifyEmailCommand(signupVerifyToken);

  //   return this.commandBus.execute(command);
  // }

  // @Post('/login')
  // async login(@Body() dto: UserLoginDto): Promise<string> {
  //   const { email, password } = dto;

  //   const command = new LoginCommand(email, password);

  //   return this.commandBus.execute(command);
  // }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   if (+id < 1) {
  //     // 1. 단순 문자열
  //     // throw new BadRequestException('id는 0보다 큰 정수여야 합니다');

  //     // 2. HttpException
  //     // throw new HttpException(
  //     //   {
  //     //     errorMessage: 'id는 0보다 큰 정수여야 합니다',
  //     //     foo: 'bar'
  //     //   },
  //     //   HttpStatus.BAD_REQUEST
  //     // );

  //     // 3. 기본 제공 예외에 description을 함께 전달
  //     throw new BadRequestException(
  //       'id는 0보다 큰 정수여야 합니다',
  //       'id format exception',
  //     );
  //   }

  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
