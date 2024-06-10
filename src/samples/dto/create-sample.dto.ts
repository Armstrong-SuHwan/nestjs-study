import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSampleDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
