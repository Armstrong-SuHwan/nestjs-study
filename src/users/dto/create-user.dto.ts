import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { NotIn } from '../../not-in';

export class CreateUserDto {
  @Transform((params) => {
    console.log(params);
    return params.value;
  })
  @Transform((params) => params.value.trim())
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  // @Transform(({ value, obj }) => {
  //   if (obj.password.includes(obj.name.trim())) {
  //     throw new BadRequestException(
  //       'Password는 name과 같은 문자열을 포함할 수 없습니다.',
  //     );
  //   }
  //   return value.trim();
  // })
  @NotIn('password', {
    message: 'Password는 name과 같은 문자열을 포함할 수 없습니다.',
  })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
