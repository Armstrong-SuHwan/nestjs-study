import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  Put,
  BadRequestException,
  Header,
  Redirect,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(202)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Response의 Type
  // import { Response } from 'express';

  // @Get()
  // findAll(@Res() res: Response) {
  //   const users = this.usersService.findAll();
  //   return res.status(202).send(users);
  // }

  // Redirect 적용
  // 서브 라우트의 정의 순서가 컨트롤러 동작에 영향
  @Get('nest')
  @Redirect('https://nestjs.com', 301)
  findAllWithRedirect() {
    console.log('redirect controller!!!!');
    return this.usersService.findAll();
  }

  // Custom Header 적용
  // Nan이 Validation이 제대로 안됨
  @Header('Custom', 'Test Header')
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('id is string type:::', id);
    if (+id < 1) {
      throw new BadRequestException('id는 0보다 큰 값이어야 합니다.');
    } else {
      console.log('id boolean', +id < 1);
      console.log('id:::', +id);
    }
    return this.usersService.findOne(+id);
  }

  // Parameter Validation 적용
  @Get(':id')
  findOneWithHeader(@Param('id', ParseIntPipe) id: number) {
    console.log('id is number type:::', id);
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id')
  updateName(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
