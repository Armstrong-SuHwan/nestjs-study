
# Chapter 12: 모든 것은 항상 실패한다: 예외 필터

## 모든 것은 항상 실패한다.
- 베르너 보겔스(Werner Vogels), AWS CTO

소프트웨어를 개발하면서 예외(Exception) 처리는 필수 사항입니다. 어떤 상황에서는 예측할 수 없고 개발자는 이 예외에 대응해 시스템을 마련해야 합니다. AWS의 CTO 베르너 보겔스는 모든 것은 항상 실패한다라는 말을 했고 이 말은 아주 중요한 의미를 갖고 있습니다. 복잡한 시스템에서는 장애 발생이 너무나도 자연스러운 일입니다. 버그가 발생했을 때, 어디에 예외의 처리 코드를 넣어야 할까요? 예외가 발생한 매번 모든 곳에 예외 처리 코드를 삽입하는 것은 중복 코드를 양산할 뿐만 아니라 기능 구현과 관련 없는 코드가 삽입됨으로 인해 기능 구현에 집중하지 못하게 됩니다. 예외가 발생했을 때 매번 로그와 콜 스택을 남겨 디버깅에 사용할 수 있는 별도의 모듈을 작성했습니다. 예외 처리 역시 따로 만들어진 한곳에서 공동으로 처리하도록 해야 합니다.

## 12.1 예외 처리

Nest는 프레임워크 내에 예외 레이어를 두고 있습니다. 애플리케이션을 통틀어 제대로 처리하지 못한 예외를 처리하는 역할을 합니다. 여러분이 아무런 작업을 하지 않아도 기본 예외 처리가 예외를 잡아 메시지와 상태 코드를 적절한 형태로 변환하여 전송합니다. 간단하게 예외를 일으켜서 에러가 어떻게 발생하는지 확인해볼까요?

```typescript
import { InternalServerErrorException } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/error')
  error(foo: any): string {
    return foo.bar();
  }
}
```

foo가 undefined이기 때문에 다음과 같은 에러가 발생합니다:

```json
$ curl http://localhost:3000/error
{
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

Nest는 예외에 대한 많은 클래스를 제공합니다. 위 결과를 보면 에러가 발생했을 때 응답을 JSON 형식으로 바꿔주고 있는데 이는 기본으로 내장된 전역 예외 필터가 처리합니다. 내장 예외 필터는 인식할 수 없는 에러(HttpException도 아니고, HttpException을 상속받지도 않은 예외들)를 InternalServerErrorException으로 변환합니다. MDN 문서에 따르면 500 InternalServerError는 "요청을 처리하는 과정에서 서버가 예상하지 못한 상황에 놓였다는 것을 나타낸다"고 되어 있습니다. InternalServerErrorException의 선언을 보면 HttpException을 상속받고 있습니다. 결국 모든 예외는 Error 객체로부터 파생된 것입니다.

```typescript
export declare class InternalServerErrorException extends HttpException {
  constructor(objectOrError?: string | object | any, description?: string);
}

export declare class HttpException extends Error {
  constructor(response: string | Record<string, any>, status: number);
}
```

그 외 Nest에서 제공하는 모든 예외 역시 HttpException을 상속하고 있습니다. 이 예외 클래스들은 응답 형식에 맞춰 적절한 예외를 던지세요(throw). 적절한 예외 처리는 API를 호출한 클라이언트에서 에러를 쉽게 이해하고 대처할 수 있도록 합니다. 예를 들어 유저 정보를 가져오기 위해 users/:id 엔드포인트로 조회를 하려고 하는데, 우리는 도메인 규칙상 id가 1보다 작은 수일 수 없다고 정했습니다(3.14절 참고). 따라서 클라이언트가 id를 0과 같이 잘못된 값으로 전달한 경우에는 400 Bad Request로 응답을 보냅니다.

```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  if (+id < 1) {
    throw new BadRequestException('id는 0보다 큰 정수여야 합니다');
  }
  return this.usersService.findOne(+id);
}
```

```json
$ curl http://localhost:3000/users/0 -v
< HTTP/1.1 400 Bad Request
{
  "statusCode": 400,
  "message": "id는 0보다 큰 정수여야 합니다",
  "error": "Bad Request"
}
```

예외의 생성자에 전달할 메시지가 응답에 함께 출력되었습니다. HttpException 클래스를 다시 자세히 살펴보겠습니다.

```typescript
export declare class HttpException extends Error {
  constructor(response: string | Record<string, any>, status: number);
}
```

생성자는 2개의 인수를 받습니다.

1. response: JSON 형식의 본문입니다. 문자열이나 Record<string, any> 타입의 객체를 전달할 수 있습니다.
2. status: 에러의 속성을 나타내는 HTTP 상태 코드입니다.

JSON 응답의 본문은 statusCode와 message 속성을 기본으로 가집니다. 이 값을 위에서 예외를 만들 때 생성자의 response와 status로 구성합니다. 미리 제공된 BadRequestException 대신 HttpException을 직접 전달하려면 다음과 같이 작성합니다.

```typescript
throw new HttpException(
  {
    errorMessage: 'id는 0보다 큰 정수여야 합니다',
    foo: 'bar',
  },
  HttpStatus.BAD_REQUEST
);
```

```json
{
  "errorMessage": "id는 0보다 큰 정수여야 합니다",
  "foo": "bar"
}
```

Nest에서 제공하는 기본 예외 클래스는 모두 생성자가 다음과 같은 모양을 가집니다.

```typescript
constructor(objectOrError?: string | object | any, description?: string);
```

BadRequestException의 내부 구현을 보면 전달받은 objectOrError와 description으로 HttpException 생성자의 첫 번째 인수(response)를 구성하는 것을 볼 수 있습니다. 그런 경우는 거의 없겠지만 만약 필요에 의해 HttpException을 상속받는 예외 클래스를 직접 만든다고 하면 이를 참조해 되겠습니다.

```typescript
export class BadRequestException extends HttpException {
  constructor(objectOrError?: string | object | any, description = 'Bad Request') {
    super(
      HttpException.createBody(objectOrError, description, HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST
    );
  }
}
```

앞서 BadRequestException을 던진 예외를 조금 바꿔 description을 전달해보겠습니다.

```typescript
throw new BadRequestException('id는 0보다 큰 정수여야 합니다', 'id format exception');
```

```json
{
  "statusCode": 400,
  "message": "id는 0보다 큰 정수여야 합니다",
  "error": "id format exception"
}
```

## 12.2 예외 필터

Nest에서 제공하는 전역 예외 필터 외에 직접 예외 필터(exception filter) 레이어를 두어, 원하는 대로 예외를 다룰 수 있습니다. 예외가 일어났을 때 로그를 남기거나 응답 객체를 원하는 대로 변경하고자 할 때 사용합니다. 예외가 발생했을 때 모든 예외(error)를 잡아서 요청 URL과 예외가 발생한 시간을 콘솔에 출력하는 예외 필터를 만들어봅시다.

```typescript
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();
    const status = (exception as HttpException).getStatus();

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
    };

    console.log(log);

    res.status(status).json(response);
  }
}
```

@Catch 데커레이터는 처리되지 않은 모든 예외를 잡으려고 할 때 사용합니다. 우리가 다루는 대부분의 예외는 이미 Nest에서 HttpException을 상속받는 클래스들로 제공한다고 했습니다. HttpException이 아닌 예외는 알 수 없는 에러이므로 InternalServerErrorException으로 처리되도록 했습니다. 이제 우리가 만든 HttpExceptionFilter를 적용해봅시다. 예외 필터는 @UseFilter 데커레이터를 컨트롤러나 특정 라우트, 전역으로 적용할 수 있습니다. 예외 필터는 전역 필터를 하나만 가질도록 하는 것이 일반적입니다.

### 특정 엔드포인트에 적용할 때

```typescript
@Controller('users')
export class UsersController {
  @Post()
  @UseFilters(HttpExceptionFilter)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### 특정 컨트롤러 전체에 적용할 때

```typescript
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  // ...
}
```

### 애플리케이션 전체에 적용할 때

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); // 전역 필터 적용
  await app.listen(3000);
}
```

부트스트랩 과정에서 전역 필터를 적용하는 방식은 필터에 의존성을 주입할 수 없다는 제약이 있습니다. 예외 필터의 수행이 예외가 발생한 모듈 외부(main.ts)에서 이루어지기 때문입니다. 의존성 주입을 받고자 한다면 예외 필터를 커스텀 프로바이더로 등록하면 됩니다.

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

이제 HttpExceptionFilter는 다른 프로바이더를 주입받아 사용할 수 있습니다. 예를 들어 외부 모듈에서 제공하는 Logger 객체를 사용한다고 하면 다음처럼 구현하겠습니다.

```typescript
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const stack = exception.stack;

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack,
    };

    this.logger.log(log);
  }
}
```

이제 다시 예외를 일으켜보고 콘솔에 출력되는 로그를 확인해봅시다.

```shell
$ curl http://localhost:3000/error
{
  timestamp: 2021-10-04T09:52:21.780Z,
  url: '/error',
  response: { statusCode: 500, message: 'Internal Server Error' }
}

$ curl http://localhost:3000/users/0
{
  timestamp: 2021-10-04T09:53:19.086Z,
  url: '/users/0',
  response: { statusCode: 400, message: 'id는 0보다 큰 정수여야 합니다', error: 'id format exception' }
}
```

이렇게 예외 필터는 `try/catch`로 잡지 못한 예외가 발생했을 때 실행됩니다. 잡지 못한 예외가 발생하면 나머지 생명주기를 무시하고 예외 필터로 건너뛰게 됩니다.


## 12.3 유저 서비스에 예외 필터 적용하기

우리의 유저 서비스에 예외 필터를 적용하는 것은 앞에서 배운 내용에서 딱히 크게 추가할 부분은 없습니다. 이전에 만든 HttpExceptionFilter와 앞 장에서 만든 LoggerService를 사용합니다. HttpExceptionFilter는 Logger를 주입받아 사용하는 방식으로 적용해봅시다. 먼저 예외 처리를 위한 ExceptionModule 모듈을 만듭니다.

```typescript
import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    Logger,
  ],
})
export class ExceptionModule {}
```

HttpExceptionFilter와 주입받을 Logger를 프로바이더로 선언합니다. ExceptionModule을 AppModule로 가져옵니다.

```typescript
import { ExceptionModule } from './exception/ExceptionModule';

@Module({
  imports: [
    // ...
    ExceptionModule,
  ],
})
export class AppModule {}
```

HttpExceptionFilter에서 예외 처리 도중 콘솔에 로그를 처리하는 부분을 Logger를 이용하도록 변경합니다. 추가로 디버깅을 위해 콜 스택을 함께 출력합니다.

```typescript
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const stack = exception.stack;

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack,
    };

    this.logger.log(log);
  }
}
```

이제 예외가 발생하면 콘솔 로그에 에러 스택이 포함된 로그를 확인할 수 있습니다.


## 12.4 더 살펴보기

이번 섹션에서는 예외 필터와 관련된 추가적인 개념들을 더 깊이 살펴보겠습니다.

### 1. 각 Http Status 코드와 관련된 이야기

HTTP 상태 코드는 클라이언트와 서버 간의 통신에서 발생하는 다양한 상황을 나타냅니다. 상태 코드는 크게 다섯 가지 범주로 나눌 수 있습니다:

- **1xx (정보)**
- **2xx (성공)**
- **3xx (리다이렉션)**
- **4xx (클라이언트 오류)**
- **5xx (서버 오류)**

아래 표는 주요 HTTP 상태 코드와 그 의미를 나타냅니다:

| 범주 | 상태 코드 | 의미 |
|-----|---------|-----|
| **1xx 정보** |
| 100 | Continue | 서버가 요청의 일부를 받았으며, 클라이언트는 계속해서 요청을 보내야 합니다. |
| 101 | Switching Protocols | 서버가 클라이언트의 프로토콜 전환 요청을 받아들였습니다. |
| **2xx 성공** |
| 200 | OK | 요청이 성공적으로 완료되었습니다. |
| 201 | Created | 요청이 성공적으로 처리되었고, 새로운 자원이 생성되었습니다. |
| 204 | No Content | 요청이 성공적으로 처리되었으나, 반환할 콘텐츠가 없습니다. |
| **3xx 리다이렉션** |
| 301 | Moved Permanently | 요청한 리소스가 새로운 URI로 영구적으로 이동했습니다. |
| 302 | Found | 요청한 리소스가 임시로 다른 URI에 위치하고 있습니다. |
| 304 | Not Modified | 클라이언트가 캐시된 리소스를 사용하고 있으며, 서버에서 새 데이터를 전송할 필요가 없습니다. |
| **4xx 클라이언트 오류** |
| 400 | Bad Request | 클라이언트의 요청이 잘못되었습니다. |
| 401 | Unauthorized | 인증이 필요합니다. |
| 403 | Forbidden | 서버가 요청을 이해했지만, 승인하지 않습니다. (정책상 허용되지 않음) |
| 404 | Not Found | 요청한 자원을 찾을 수 없습니다. |
| 405 | Method Not Allowed | 요청한 메서드는 서버에서 허용되지 않습니다. |
| 422 | Unprocessable Entity | 요청은 잘 형성되었지만, 따를 수 없는 지시가 포함되어 있습니다. |
| 429 | Too Many Requests | 클라이언트가 너무 많은 요청을 보냈습니다. |
| **5xx 서버 오류** |
| 500 | Internal Server Error | 서버에서 예기치 못한 상황이 발생했습니다. |
| 502 | Bad Gateway | 서버가 게이트웨이 또는 프록시로서 잘못된 응답을 받았습니다. |
| 503 | Service Unavailable | 서버가 현재 요청을 처리할 수 없습니다. (예: 유지 보수 또는 과부하) |
| 504 | Gateway Timeout | 서버가 게이트웨이 또는 프록시로서 응답을 받을 수 없습니다. |

### 2. Record 타입이란 무엇인가?

`Record` 타입은 TypeScript에서 제공하는 유틸리티 타입 중 하나입니다. 이는 객체 타입을 좀 더 명확하게 정의할 수 있게 해줍니다.

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```
예를 들어, Record<string, number> 타입은 키가 문자열이고 값이 숫자인 객체를 나타냅니다.

```typescript
const scores: Record<string, number> = {
  math: 95,
  science: 90,
  english: 85,
};
```
Record 타입은 특히 동적 키를 사용할 때 유용합니다.

### 3. 부트스트랩 과정에서 전역 필터를 적용하는 방식의 제약
부트스트랩 과정에서 전역 필터를 적용할 때 의존성 주입이 불가능한 이유는 필터가 모듈 외부에서 생성되기 때문입니다.

예를 들어, 다음과 같이 main.ts에서 필터를 적용하면:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
```
이 경우, HttpExceptionFilter는 AppModule의 DI(Dependency Injection) 컨테이너 외부에서 생성되므로, 필터에 필요한 의존성(예: Logger 클래스)을 주입할 수 없습니다.

이를 해결하기 위해 필터를 커스텀 프로바이더로 등록하면, Nest의 DI 컨테이너를 통해 필터를 생성하고 의존성을 주입할 수 있습니다.

```typescript
import { Module, Logger } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    Logger,
  ],
})
export class ExceptionModule {}
```
이 방식의 장점은 의존성 주입을 통해 필터 내부에서 필요한 서비스를 사용할 수 있다는 것입니다. 의존성 주입을 통해 필요한 서비스를 제공받지 못하면, 해당 서비스의 기능을 사용할 수 없거나, 테스트하기 어려워지는 등의 문제가 발생할 수 있습니다.

### 4. import { APP_FILTER } from '@nestjs/core'; 에서 APP_FILTER의 역할
APP_FILTER는 NestJS에서 전역 예외 필터를 설정할 때 사용하는 토큰입니다. 이 토큰을 사용하여 특정 예외 필터를 전역으로 적용할 수 있습니다.

예를 들어, 아래와 같이 APP_FILTER를 사용하여 예외 필터를 전역으로 등록할 수 있습니다:

```typescript
import { Module, Logger } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    Logger,
  ],
})
export class ExceptionModule {}
```
이렇게 하면 HttpExceptionFilter가 애플리케이션 전체에서 발생하는 예외를 처리하도록 설정됩니다. APP_FILTER를 사용함으로써, 특정 모듈이나 경로에 종속되지 않고 전역적으로 예외 필터를 적용할 수 있습니다.

## 12.5 더 추가할 부분 (NEST DOCS)

### Exception filters

NestJS는 애플리케이션 전반에 걸쳐 발생하는 모든 예외를 처리하는 **예외 레이어**를 내장하고 있습니다. 예외가 애플리케이션 코드에 의해 처리되지 않을 경우, 이 레이어가 해당 예외를 잡아 적절한 사용자 친화적 응답을 자동으로 보냅니다.

기본적으로 이 작업은 `HttpException` 유형의 예외(및 그 하위 클래스)를 처리하는 내장 **전역 예외 필터**에 의해 수행됩니다. 인식되지 않은 예외(`HttpException`이 아니거나 이를 상속받지 않은 클래스인 경우)일 때, 기본 예외 필터는 다음과 같은 기본 JSON 응답을 생성합니다:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```
기본 예외 필터는 http-errors 라이브러리를 부분적으로 지원합니다. 기본 HttpException이 아닌 예외를 던지더라도, statusCode와 message 속성을 포함하는 예외는 올바르게 채워져 응답으로 전송됩니다.

표준 예외 던지기
Nest는 @nestjs/common 패키지에서 노출된 내장 HttpException 클래스를 제공합니다. 일반적인 HTTP REST/GraphQL API 기반 애플리케이션에서는 특정 오류 조건이 발생할 때 표준 HTTP 응답 객체를 보내는 것이 모범 사례입니다.

예를 들어, CatsController에서 findAll() 메소드가 예외를 던지도록 하려면 다음과 같이 할 수 있습니다:

```typescript
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```
클라이언트가 이 엔드포인트를 호출하면 응답은 다음과 같습니다:

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```
HttpException 생성자는 응답을 결정하는 두 개의 필수 인수를 받습니다:

response 인수는 JSON 응답 본문을 정의합니다. 문자열이나 객체를 전달할 수 있습니다.
status 인수는 HTTP 상태 코드를 정의합니다.
기본적으로 JSON 응답 본문에는 두 개의 속성이 포함됩니다:

statusCode: status 인수로 제공된 HTTP 상태 코드
message: status에 기반한 HTTP 오류에 대한 짧은 설명
JSON 응답 본문의 메시지 부분만 재정의하려면 response 인수에 문자열을 제공하세요. 전체 JSON 응답 본문을 재정의하려면 response 인수에 객체를 전달하세요. Nest는 객체를 직렬화하여 JSON 응답 본문으로 반환합니다.

세 번째 생성자 인수(선택 사항)는 오류 원인을 제공하는 데 사용할 수 있는 options입니다. 이 cause 객체는 응답 객체에 직렬화되지 않지만, 로깅 목적으로 유용할 수 있습니다. 내부 오류에 대한 유용한 정보를 제공하기 때문입니다.

다음은 전체 응답 본문을 재정의하고 오류 원인을 제공하는 예제입니다:

```typescript
@Get()
async findAll() {
  try {
    await this.service.findAll()
  } catch (error) {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN, {
      cause: error
    });
  }
}
```
이 경우 응답은 다음과 같이 보입니다:

```json
{
  "status": 403,
  "error": "This is a custom message"
}
```
사용자 정의 예외
대부분의 경우, 사용자 정의 예외를 작성할 필요 없이 내장된 Nest HTTP 예외를 사용할 수 있습니다. 사용자 정의 예외가 필요한 경우에는 기본 HttpException 클래스를 상속받아 예외 계층 구조를 만드는 것이 좋습니다. 이 접근 방식을 사용하면 Nest가 예외를 인식하고, 오류 응답을 자동으로 처리합니다. 다음은 사용자 정의 예외를 구현하는 예제입니다:

```typescript
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```
이제 ForbiddenException이 기본 HttpException을 확장하므로, findAll() 메소드 내에서 사용할 수 있습니다:

```typescript
@Get()
async findAll() {
  throw new ForbiddenException();
}
```
내장 HTTP 예외
Nest는 기본 HttpException을 상속하는 표준 예외 세트를 제공합니다. 이는 @nestjs/common 패키지에서 노출되며, 가장 일반적인 HTTP 예외를 나타냅니다:

- BadRequestException
- UnauthorizedException
- NotFoundException
- ForbiddenException
- NotAcceptableException
- RequestTimeoutException
- ConflictException
- GoneException
- HttpVersionNotSupportedException
- PayloadTooLargeException
- UnsupportedMediaTypeException
- UnprocessableEntityException
- InternalServerErrorException
- NotImplementedException
- ImATeapotException
- MethodNotAllowedException
- BadGatewayException
- ServiceUnavailableException
- GatewayTimeoutException
- PreconditionFailedException

내장된 모든 예외는 options 매개변수를 사용하여 오류 원인과 오류 설명을 제공할 수 있습니다:

```typescript
throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' })
```
이 경우 응답은 다음과 같이 보입니다:

```json
{
  "message": "Something bad happened",
  "error": "Some error description",
  "statusCode": 400,
}
```
기본 예외 필터는 많은 경우를 자동으로 처리할 수 있지만, 예외 레이어에 대한 완전한 제어가 필요할 수 있습니다. 예를 들어, 로깅을 추가하거나 동적 요인에 따라 다른 JSON 스키마를 사용하고 싶을 때입니다. 예외 필터는 정확한 제어 흐름과 클라이언트에 반환되는 응답의 내용을 제어할 수 있게 해줍니다.

다음은 HttpException 클래스의 인스턴스를 잡아내고, 이를 위한 사용자 정의 응답 로직을 구현하는 예외 필터를 만드는 예제입니다. 이를 위해 기본 플랫폼 Request 및 Response 객체에 접근해야 합니다. Request 객체에 접근하여 원래 url을 가져와 로깅 정보에 포함할 수 있습니다. Response 객체를 사용하여 response.json() 메소드를 사용해 응답을 직접 제어합니다.

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```

@Catch(HttpException) 데코레이터는 필요한 메타데이터를 예외 필터에 바인딩하여, Nest가 이 특정 필터가 HttpException 유형의 예외만 찾고 있음을 알립니다. @Catch() 데코레이터는 단일 매개변수 또는 쉼표로 구분된 목록을 받을 수 있습니다. 이를 통해 여러 유형의 예외에 대해 필터를 설정할 수 있습니다.

### Arguments host
catch() 메소드의 매개변수를 살펴보겠습니다. exception 매개변수는 현재 처리 중인 예외 객체입니다. host 매개변수는 ArgumentsHost 객체입니다. ArgumentsHost는 다양한 컨텍스트에서 사용할 수 있는 강력한 유틸리티 객체입니다.

ArgumentsHost는 NestJS가 다양한 애플리케이션 컨텍스트(예: HTTP, RPC, WebSockets)에서 일관된 방법으로 요청 처리 파이프라인에 접근할 수 있도록 하는 추상화 계층입니다. ArgumentsHost는 다음과 같은 메소드를 제공합니다:

- switchToHttp(): HTTP 요청/응답 객체에 접근할 수 있는 HttpArgumentsHost 객체를 반환합니다. 이를 통해 Request 및 Response 객체에 접근할 수 있습니다.
- switchToRpc(): RPC 컨텍스트로 전환하여 RPC 특정 객체에 접근할 수 있습니다.
- switchToWs(): WebSocket 컨텍스트로 전환하여 WebSocket 특정 객체에 접근할 수 있습니다.
- getType(): 현재 컨텍스트의 유형을 반환합니다. 반환 값은 http, rpc, 또는 ws 중 하나입니다.

예제: HTTP 컨텍스트에서 ArgumentsHost 사용
아래 예제는 HttpExceptionFilter 클래스에서 ArgumentsHost를 사용하여 HTTP 요청 및 응답 객체에 접근하는 방법을 보여줍니다.

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}

```

아래 예제는 여러 컨텍스트에서 ArgumentsHost를 사용하는 방법을 보여줍니다.

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const contextType = host.getType();

    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const status = exception.getStatus();

      response
        .status(status)
        .json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    } else if (contextType === 'rpc') {
      const ctx = host.switchToRpc();
      const data = ctx.getData();
      // RPC 응답 처리
    } else if (contextType === 'ws') {
      const ctx = host.switchToWs();
      const client = ctx.getClient();
      const data = ctx.getData();

      // WebSocket 응답 처리
      client.emit('error', {
        statusCode: exception.getStatus(),
        timestamp: new Date().toISOString(),
        message: exception.message,
      });
    }
  }
}
```

위 예제에서는 host.getType() 메소드를 사용하여 현재 컨텍스트의 유형을 확인하고, 해당 유형에 따라 적절한 처리를 수행합니다. WebSocket 컨텍스트의 경우, 클라이언트에 에러 메시지를 전송하는 예제를 포함하였습니다. 이는 다양한 컨텍스트에서 예외를 처리할 때 유용합니다