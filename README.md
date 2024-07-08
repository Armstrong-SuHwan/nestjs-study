# 10장 권한 확인을 위한 가드


- [10장 권한 확인을 위한 가드](#10장-권한-확인을-위한-가드)
  - [참고 페이지](#참고-페이지)
      - [](#)
      - [미들웨어](#미들웨어)
      - [가드](#가드)
      - [가드 실행 시점](#가드-실행-시점)
  - [Guard](#guard)
    - [rxjs](#rxjs)
      - [비동기 작업 (Asynchronous Task)](#비동기-작업-asynchronous-task)
      - [비동기 스트림 (Asynchronous Stream)](#비동기-스트림-asynchronous-stream)
    - [Execution Context?](#execution-context)
    - [ArgumentsHost](#argumentshost)
  - [Role-Based Guard](#role-based-guard)
    - [Hybrid application](#hybrid-application)
    - [Custom Metadata](#custom-metadata)
  - [마무리](#마무리)


## 참고 페이지
https://docs.nestjs.com/guards

![가드](https://docs.nestjs.com/assets/Guards_1.png)

####
authentication(인증) : 실패시 http status code 401 unauthorized
authorization(인가) : 실패시 http status code 403 Forbidden

#### 미들웨어
authentication(인증)은 전통적인 Express 애플리케이션에서 주로 미들웨어에 의해 처리되었습니다.

하지만 미들웨어는 next() 함수를 호출한 후에 어떤 핸들러가 실행될지 모릅니다. (dumb하다고 표현)

#### 가드
Guard는 single responsibility 를 가집니다. (데이터 유효성 검사와 같은 다른 책임을 가지지 않는다는말)

Guard를 구현하는 가장 좋은 사례는 authorization(인가)입니다.

Guard는 Permission, Role, ACL 접근 제어 목록 등 과 같은 조건에 따라 Request가 라우트 핸들러에 의해 처리될지 말지를 결정합니다.

특정 라우트는 Caller(주로 인증된 사용자)가 충분한 권한을 가지고 있을 때만 접근 가능해야 하기 때문입니다.

Guard는 ExecutionContext 인스턴스에 접근할 수 있어, Middleware와 달리 다음에 실행될 것이 무엇인지 정확히 알고 있습니다.

이들은 exception filters, pipes, interceptors 와 마찬가지로, request/response lifecycle 정확한 지점에서 처리 로직을 선언적으로 삽입할 수 있도록 설계되었습니다. 


#### 가드 실행 시점
Middleware >>>> Guards >>>> Interceptor or Pipe

## Guard 

Guard는 CanActivate 인터페이스를 구현하고, @Injectable 데코레이터가 달린 클래스입니다.

Guard가 ExecutionContext에 접근할 수 있다는 말은, Guard가 현재 실행중인 컨텍스트의 상세 정보에 접근할 수 있다는 말입니다.

상세 정보는 Request의 상세 정보들, 그리고 그것이 실행될 타겟 핸들러 까지 포함합니다.


auth.guard.ts
```javascript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(request): boolean {
    // Perform validation logic here
    return true;  // or false if validation fails
  }
}
```

모든 Guard는 canActivate() function 을 구현해야 합니다.

그리고 이 function은 bool을 리턴해야 합니다.

이 bool값은 현재 요청이 허용되냐 안되냐를 의미합니다. 동기, 비동기 모두 가능합니다.

NestJS는 이 리턴 값을 next action 을 컨트롤 할 때 사용합니다.

만약 요청이 Http 요청이라면, Request에 있는 토큰, 헤더정보, request-specific 데이터를 활용할 수 있고

Guard는 어떤 controller method (=Handler)와, 어떤 controller class가 호출되는지를 알 수 있고 그 controller의 metadata 를 활용할 수 있습니다.

이렇게 얻은 데이터를 validateRequest 함수에서 validation 로직을 수행합니다.

if it returns true, the request will be processed.

if it returns false, Nest will deny the request. 403 forbidden

여기서 false를 리턴하면
nestjs 프레임워크에서는 알아서 ForbiddenException를 던집니다
만약 다른 걸 던지고 싶으면 throw new UnauthorizedException(); 뭐 이런거 넣으면 됩니다

Guard에서 던져진 모든 익셉션들은 exceptions layer 에서 처리가 된다고 합니다.


### rxjs
RxJS (Reactive Extensions for JavaScript) 

비동기 및 이벤트 기반 프로그램을 쉽게 작성할 수 있도록 도와주는 라이브러리입니다. 

RxJS는 Observable을 사용하여 데이터 스트림을 생성하고, 
이러한 스트림을 다양한 연산자를 통해 조작할 수 있게 해줍니다. 

이는 특히 복잡한 비동기 데이터 흐름, 예를 들어 사용자 입력, HTTP 요청, 실시간 데이터 업데이트 등을 처리하는 데 유용합니다.


```javascript
canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
```

위에 canActivate 시그니쳐를 살펴보면 파라미터는 ExecutionContext 이고, 리턴타입은 3가지 인데, 이 중 하나를 반환할 수 있다는 말입니다.

- boolean: 동기적으로 true 또는 false 값을 반환하여 접근 허용 여부를 결정합니다.
- Promise<boolean>: 비동기 작업을 처리한 후 true 또는 false 값을 반환합니다. 비동기 작업이 완료될 때까지 가드가 대기합니다.
- Observable<boolean>: 비동기 스트림을 통해 true 또는 false 값을 반환합니다. 이는 RxJS의 Observable을 사용하여 비동기 작업을 처리합니다.

비동기 스트림과 비동기 작업은 둘 다 비동기적으로 작업을 처리하지만, 그 사용 방식과 목적이 다릅니다. 다음은 각 개념의 차이점과 특징입니다.

#### 비동기 작업 (Asynchronous Task)
비동기 작업은 하나의 작업이 완료될 때까지 기다리지 않고 다른 작업을 계속 수행할 수 있게 해주는 방식입니다. 이는 주로 Promise를 통해 구현됩니다.

[특징]
1. 단일 결과: 비동기 작업은 일반적으로 하나의 결과를 반환합니다.
2. 일회성 작업: 비동기 작업은 한 번 실행되어 완료되면 끝납니다.
3. 비동기 함수: 주로 async/await 구문과 함께 사용됩니다.
4. 예제: 데이터베이스 쿼리, 파일 읽기/쓰기, 네트워크 요청 등

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data received');
    }, 1000);
  });
}

async function getData() {
  try {
    const data = await fetchData();
    console.log(data); // Output: Data received
  } catch (error) {
    console.error(error);
  }
}

getData();
```

#### 비동기 스트림 (Asynchronous Stream)
비동기 스트림은 데이터의 연속적인 흐름을 처리하는 방식입니다. 이는 RxJS의 Observable을 통해 구현되며, 스트림 내에서 여러 개의 값을 순차적으로 처리할 수 있습니다.
[특징]
1. 다중 결과: 비동기 스트림은 여러 개의 값을 순차적으로 또는 동시에 방출할 수 있습니다.
2. 지속성 작업: 스트림은 구독자가 취소할 때까지 계속 데이터를 방출할 수 있습니다.
3. 연산자 사용: 다양한 연산자를 사용하여 스트림 데이터를 조작하고 변환할 수 있습니다.
4. 예제: 사용자 입력, 실시간 데이터 업데이트, 웹소켓 메시지 등
```javascript
import { Observable } from 'rxjs';

const observable = new Observable(subscriber => {
  let count = 0;

  //1초 간격으로 setInterval을 통해 subscriber.next(count++)를 호출하여 subscriber에게 count 값을 보내고
  //count 값이 5보다 크면 subscriber.complete()를 호출하여 스트림을 완료하고 
  //setInterval을 clear합니다.

  const intervalId = setInterval(() => {
    subscriber.next(count++);
    if (count > 5) {
      subscriber.complete();
      clearInterval(intervalId);
    }
  }, 1000);
});

observable.subscribe({
  //next 메서드는 Observable이 새로운 값을 생성할 때마다 호출됩니다.
  next(x) { console.log('Next value:', x); },

  //complete 메서드는 Observable이 완료될 때 호출됩니다.
  complete() { console.log('Stream completed'); }
});

//Next value: 0
//Next value: 1
//Next value: 2
//Next value: 3
//Next value: 4
//Next value: 5
//Stream completed
```

1. 결과의 수
- 비동기 작업: 일반적으로 하나의 결과를 반환합니다.
- 비동기 스트림: 여러 개의 결과를 연속적으로 반환할 수 있습니다.

2. 작업의 지속성:
- 비동기 작업: 하나의 작업이 완료되면 끝납니다.
- 비동기 스트림: 데이터 스트림은 구독자가 존재하는 한 계속됩니다.

3. 데이터 처리 방식:
- 비동기 작업: 하나의 비동기 작업을 처리하는 동안 다른 작업을 처리할 수 있습니다.
- 비동기 스트림: 스트림 연산자를 통해 데이터 흐름을 조작하고 변환할 수 있습니다.

4. 사용 사례:
- 비동기 작업: 단일 비동기 작업을 처리하는 경우에 적합합니다.
- 비동기 스트림: 지속적인 데이터 흐름을 처리하는 경우에 적합합니다.


### Execution Context?
ExecutionContext는 ArgumentsHost를 상속받는 인터페이스입니다.

상속받음으로써 몇가지 Helper Method를 가질 수 있습니다.

현재 처리 중인 요청에 대한 다양한 정보를 추출할 수 있는(Context에 접근할 수 있는) Method 들 입니다.


ExecutionContext
```javascript
export interface ExecutionContext extends ArgumentsHost {
    //Returns the *type* of the controller class which the current handler belongs to.
    getClass<T = any>(): Type<T>;
    
    //Returns a reference to the handler (method) that will be invoked next in the request pipeline.
    getHandler(): Function;
}
```

### ArgumentsHost
ArgumentHost는 NestJS에서 핸들러에 전달된 아규먼츠에 접근할 수 있는 메서드를 제공하는 인터페이스입니다. 
HTTP, WebSocket, RPC와 같은 다양한 컨텍스트에서 작동하며, 
실행 컨텍스트를 래핑하여 이러한 아규먼츠에 접근할 수 있는 일관된 방법을 제공합니다. 
이를 통해 요청 유형에 관계없이 아규먼츠에 쉽게 접근할 수 있습니다.

이러한 추상화를 통해 전통적인 웹 애플리케이션부터 실시간 시스템 및 마이크로서비스에 이르기까지 다양한 애플리케이션을 구축하는 데 있어 NestJS를 강력하고 유연한 프레임워크로 만듭니다.

```javascript
export type ContextType = 'http' | 'ws' | 'rpc';

//Methods to obtain request and response objects.
export interface HttpArgumentsHost {
    //Returns the in-flight `request` object.
    getRequest<T = any>(): T;
    //Returns the in-flight `response` object.
    getResponse<T = any>(): T;
    getNext<T = any>(): T;
}

//Methods to obtain WebSocket data and client objects.
export interface WsArgumentsHost {
    //Returns the data object.
    getData<T = any>(): T;
    //Returns the client object.
    getClient<T = any>(): T;
    //Returns the pattern for the event
    getPattern(): string;
}

//Methods to obtain RPC data object.
export interface RpcArgumentsHost {
    //Returns the data object.
    getData<T = any>(): T;
    //Returns the context object.
    getContext<T = any>(): T;
}

/**
 * Provides methods for retrieving the arguments being passed to a handler.
 * Allows choosing the appropriate execution context (e.g., Http, RPC, or
 * WebSockets) to retrieve the arguments from.
 *
 * @publicApi
 */
export interface ArgumentsHost {
    //Returns the array of arguments being passed to the handler.
    getArgs<T extends Array<any> = any[]>(): T;
    
    //Returns a particular argument by index.
    // @param index index of argument to retrieve
    getArgByIndex<T = any>(index: number): T;
    
    //Switch context to RPC.
    // @returns interface with methods to retrieve RPC arguments
    switchToRpc(): RpcArgumentsHost;
    
    //Switch context to HTTP.
    // @returns interface with methods to retrieve HTTP arguments
    switchToHttp(): HttpArgumentsHost;
    
    //Switch context to WebSockets.
    //@returns interface with methods to retrieve WebSockets arguments
    switchToWs(): WsArgumentsHost;
    
    //Returns the current execution context type (string)
    getType<TContext extends string = ContextType>(): TContext;
}

```


## Role-Based Guard

Basic Guard Template
```javascript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}

```

```javascript
//cats.controller.ts
import { UseGuards } from '@nestjs/common';

@Controller('cats')
@UseGuards(RolesGuard)
//@UseGuards(new RolesGuard())
export class CatsController {}
```

여기에서 UseGuards 에 RolesGuard 인스턴스가 아니라 클래스를 넘겨줬습니다.

인스턴스화 하고 의존성 주입 하는 책임은 프레임웍에 넘긴 것 입니다.

하지만 Pipes 와 Exception Filter에서 본 것 처럼 in-place instance 를 넘길 수도 있습니다.

* In-place instance : 메모리 공간을 새로 할당하지 않고, 제자리에서 직접 수정하거나 재사용한다
quick sort, heap sort 에서 새로운 배열을 생성하지 않고 기존 배열을 직접 수정하여 정렬하는데, 이 것이 그 예라고 함

여러 종류의 Guard를 적용하고 싶다면 , 로 붙이면 됩니다.


CatsController 생성자는 이 Controller에 의해 선언된 모든 핸들러에 Guard를 붙입니다.
만약 특정 Method에만 Guard를 붙이고 싶다면, @UseGuards() 데코레이터를 메소드레벨에 붙이면 됩니다.

만약 Global로 Guard를 붙이고 싶다면, 부트스트랩 과정을 수행해야 합니다.

useGlobalGuards를 Nest Application 인스턴스 만들때 붙이면 됩니다.

useGlobalPipes()랑 똑같음


```javascript
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

근데, Hybrid Application 인 경우에는 useGlobalGuards()를 써도, gateways와 microservices에는 default로 붙지 않는다고 합니다.
근데 "standard" (non-hybrid) microservice apps 에서는 useGlobalGuards()가 잘 마운트 된다고 합니다

### Hybrid application
```javascript
const app = await NestFactory.create(AppModule);
const microservice = app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.TCP,
});

await app.startAllMicroservices();
await app.listen(3001);
```


useGlobalGuards를 사용한 경우에는, 모듈 외부에서 등록된 것이기 때문에
모듈의 컨텍스트 외부에서 실행되므로 모듈 내부에서 의존성을 주입할 수 없습니다.
따라서 아래 처럼 커스텀 프로바이더로 선언해서 모듈 내부에서 직접 가드를 설정할 수 있습니다.

```javascript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```





### Custom Metadata

CatsController가 각각의 Route 마다 다른 Permission Schemes 를 가질 수 있게 하려면?

즉 일부는 관리자 사용자에게만 제공될 수 있고, 다른 일부는 모든 사용자에게 열려 있는 것 처럼
Role을 Route에 매칭하려면 어떻게 해야 하는지?

이 때 custom metadata 를 활용합니다.

이를 활용해서 유연하고 재사용 가능한 방식으로 Role 을 Route에 매칭 가능합니다.


Route Handler에 Custom Metadata를 붙이려면?
1. Reflector#createDecorator Static Method를 통해 생성된 데코레이터 활용
2. 내장된 @SetMetadata() 데코레이터 활용



```javascript
//roles.decorator.ts

import { Reflector } from '@nestjs/core';

//The Roles decorator here is a function that takes a single argument of type string[].
export const Roles = Reflector.createDecorator<string[]>();
```



```javascript
//cats.controller.ts

import { Roles } from '.roles.decorator.ts';

@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

create method에 아까 만든 Roles 데코레이터 metadata를 붙였습니다.

이 것이 의미하는 것은, admin 롤을 가진 유저만 이 라우트로 접근이 허용되었다는 것입니다.


Reflector#createDecorator를 사용하는 것과 다른 방법으로,
built-in @SetMetadata() 를 사용할 수 있습니다.


```javascript
//cats.controller.ts
import { SetMetadata } from '@nestjs/common';

@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

SetMetadata 를 이렇게 직접 사용하는 것은 좋은 방법이 아닙니다.


```javascript
//roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

//메타데이터에 roles키값에 roles 스트링 배열 값 셋!
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```


```javascript
//cats.controller.ts
import { Roles } from '.roles.decorator.ts';

@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```



## 마무리


```javascript
//roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  
  //생성자에서 받은 reflector로 metadata를 읽을 수 있음.
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    
    const roles = this.reflector.get(Roles, context.getHandler());
    //const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}
```

```javascript
@Roles('admin')
@Get('admin-route')
getAdminData() {
  // 관리자 전용 로직
}
```


```javascript
function matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
  return requiredRoles.some(role => userRoles.includes(role));
}
```

