# Nestjs Study 

## Pipes
![img.png](img.png)

Pipe 목적:

- 변환(transformation): 입력 데이터를 원하는 형식으로 변한. 예를 들어 users/user/1 내의 경로 매개변수 문자열 1을 정수로 변환 
- 유효성 검사(validation): 입력 데이터가 사용자가 정한 기준에 유효하지 않은 경우 예외처리

## Built-in pipes
nest/common 패키지에 내장 파이프 
- ValidationPipe
- ParseIntPipe
- ParseFloatPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- ParseEnumPipe
- DefaultValuePipe
- ParseFilePipe

## Binding pipes (ParseIntPipe example)
1. /users/user/:id 에 전달된 매개변수 id(문자열)을 정수타입으로 변환
```bash
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.userService.findOne(id);
}
```
2. 파싱 가능하지 않은 문자열 전달시 에러 발생
```bash
curl http://localhost:3000/users/WRONG     
curl : {
  "statusCode":400,
  "message":"Validation failed (numeric string is expected)",
  "error":"Bad Request"
  }
```

## Custom pipes
PipeTransform 인터페이스를 상속 받은 클래스에 @Injectable() 데코레이터 표기

모든 파이프는 transform() 함수를 구현해야 하며, 두 개의 매개변수 존재
- value : 현재 파이프에 전달된 인수
- metadata : 현재 파이프에 전달된 인수의 메타데이터
  ```bash
  # metadata 속성
  export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown> | undefined;
  data?: string | undefined;
  }
  ```
  | 속성       | 설명                                                                                      |
  |----------|-----------------------------------------------------------------------------------------|
  | type     | 파이프에 전달된 인수가 body @Body(), query @Query(), param @Param(), 또는 custom parameter 인지 나타낸다. |
  | metatype | 인수의 메타 타입을 제공한다.  핸들러에서 타입을 생략하거나 바닐라 자바스크립트를 사용하면 undefined가 된다.                       
  | data     | 데코레이터에 전달된 문자열. 매개변수 이름                                                                 

### Class validator
1. CreateUserDto 구현
```bash
# dto.create-user.dto.ts
import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  # name 속성은 1글자 이상 20글자 이하인 문자열을 받는다
  @IsString()
  @MinLength(1) 
  @MaxLength(20)
  readonly name: string;
  
  # email 속성은 이메일 형식을 따르는지 체크한다
  @IsEmail()
  email: string;
}
```
2. Custom Pipe 구현
```bash
# validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    # 전달된 metatype 이 파이프가 지원하는 타입인지 확인
    if (!metatype || !this.toValidate(metatype)) {
      # 지원하는 타입이 아닐 경우 유효성 검사 스킵하고 원래 값 리턴
      return value; 
    }
    # class-transformer 를 사용해 순수 JavaScript 객체를 클래스의 인스턴스로 변환
    const object = plainToInstance(metatype, value);
    # class-validator를 사용해 객체의 유효성 검사
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  # metatype이 이 기본 타입(String, Boolean, Number, Array, Object)에 포함되어 있는지 확인
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```
3. ValidationPipe 적용하여  POST body 검증
```bash
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
```
name과 email 값이 없는 경우, 에러 발생
```bash
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{ "name": "", "email": "" }'                           
Invoke-RestMethod : {"statusCode":400,"message":["name must be longer than or equal to 1 characters","email must be an email"],"error":"Bad Request"}
```

### Global scoped pipes
ValidationPipe을 핸들러마다 설정하지 않고 전역으로 설정하고 싶은 경우 useGlobalPipes()를 설정한다.
```bash
# maint.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```
## Using the built-in ValidationPipe
1. create-user.dto 구현
```bash
# create-user.dto.ts
import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { NotIn } from 'src/utils/decorators/not-in';

export class CreateUserDto {
  @Transform(params => params.value.trim())
  @NotIn('password', { message: 'password는 name과 같은 문자열을 포함할 수 없습니다.' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @Transform(({ value, obj }) => {
    // if (obj.password.includes(obj.name.trim())) {
    //   throw new BadRequestException('password는 name과 같은 문자열을 포함할 수 없습니다.');
    // }
    return value.trim();
  })
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
```
2. 유효성 검사 
- email 형식이 잘못된 경우
```bash
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{ "name": "test", "email":"@gmail.com","password":"password" }'      
Invoke-RestMethod : {"message":["email must be an email"],"error":"Bad Request","statusCode":400}
```
- password 길이가 짧은 경우
```bash
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{ "name": "test", "email":"test@gmail.com","password":"pass" }'
Invoke-RestMethod : {"message":["password must match /^[A-Za-z\\d!@#$%^&*()]{8,30}$/ regular expression"],"error":"Bad Request","statusCode":400}
```
- password에 name과 같은 문자열이 포함된 경우
```bash
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{ "name": "test", "email":"test@gmail.com","password":"test-pass" }'
Invoke-RestMethod : {"message":["password는 name과 같은 문자열을 포함할 수 없습니다.","password must match /^[A-Za-z\\d!@#$%^&*()]{8,30}$/ regular expression"],"error":"Bad Request","statusCode":400}
```
- name의 앞뒤에 공백이 포함된 경우 : 정상 동작
```bash
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{ "name": " test ", "email":"test@gmail.com","password":"password" }'
```
```bash
$ npm install
```

3. 커스텀 유효성 검사기 
```bash
# not-in.ts
import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export function NotIn(property: string, validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'NotIn', ## 데코레이터 이름
      target: object.constructor, ## 데코레이터는 객체가 생성될때 적용됨
      propertyName,
      options: validationOptions,
      constraints: [property],  # property라는 이름의 다른 속성을 기준으로 유효성 검사를 수행합니다.
      validator: { # 유효성 검사 로직을 정의
        #  value는 데코레이터가 적용된 속성의 값, args는 유효성 검사 인수
        validate(value: any, args: ValidationArguments) {
          # relatedPropertyName : 데코레이터가 참조하는 다른 속성의 이름
          const [relatedPropertyName] = args.constraints; 
          # relatedValue: 데코레이터가 참조하는 다른 속성의 값
          const relatedValue = (args.object as any)[relatedPropertyName];
          # value가 문자열이고, relatedValue가 문자열이며, value가 relatedValue에 포함되지 않으면 return true, 아니면 return false
          return typeof value === 'string' && typeof relatedValue === 'string' &&
            !relatedValue.includes(value);
        }
      },
    });
  };
}
```

## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
