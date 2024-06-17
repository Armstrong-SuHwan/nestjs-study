# Ch.5 SW 복잡도를 낮추기 위한 모듈 설계

## 모듈: 응집성 있는 설계

> cf)
> 
> [응집도](https://ko.wikipedia.org/wiki/%EC%9D%91%EC%A7%91%EB%8F%84): 모듈 안의 요소들이 함께 속하는 정도
> 
> [결합도](https://ko.wikipedia.org/wiki/%EA%B2%B0%ED%95%A9%EB%8F%84): 다른 모듈에 의존하는 정도


![img.png](https://docs.nestjs.com/assets/Modules_1.png)

- Nest.Js 애플리케이션 내에는 __적어도 한 개의 모듈이 존재한다.__ (Root Module)

## @Module

- @Module은 `ModuleMetadata`를 데커레이터의 인수로 받는다.

>
> - imports: 이 모듈에서 필요한 프로바이더를 추출한 모듈들의 리스트 (필요로 하는 서비스를 가진 모듈들)
> - controllers: 이 모듈에서 인스턴트화 될 컨트롤러들
> - providers: Nest에 의해 주입될 서비스 객체. 모듈 내에서는 공유됨.
> - exports: 이 모듈의 provider 중 다른 모듈에서도 사용할 수 있도록 추출할 provider의 모음
> 

- 모듈의 provider는 __캡슐화__ 되는 것이 디폴트다.
- 따라서, 다른 모듈에서 사용하게 하고 싶다면 반드시 exports에 추가해야 한다. (API)

## Feature Module
- 책의 UserModule, EmailModule 만드는 과정 참고

## Shared Module
- Nest에서 모듈은 기본적으로 Singleton이다. 따라서, 여러 모듈에서 한 provider의 instance를 공유할 수도 있다.
- Export 되는 순간, 해당 모듈은 Shared Module이라고 보면 된다.

## 모듈 다시 내보내기

- 모듈이 내부의 provider를 export 할 수 있는 것처럼, import한 모듈을 다시 export 할 수도 있다.
  (책의 CommonModule, CoreModule)

### CommonModule.ts
```typescript
@Module({
  imports: [CommonService],
  exports: [CommonService],
})
export class CommonModule { }
```

### CoreModule.ts
```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule { }
```

### AppModule.ts
```typescript
@Module({
  imports: [CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class CoreModule { }
```
## 의존성 주입과 순환 참조
- module class도 provider를 주입할 수 있습니다.
```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```
> __하지만 순환 참조 문제로 모듈 자체를 provider로서 주입하지는 않습니다.__

### Nest에서의 순환참조
- Nest에서는 모듈과 provider 간의 순환참조가 일어날 수 있습니다.
- Nest에서는 해결책으로 두 가지를 제시합니다.

#### 1. Forward reference

cats.service.tsJS
```typescript
@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService,
  ) {}
}
```
common.service.ts
```typescript
@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private catsService: CatsService,
  ) {}
}
```

#### 2. ModuleRef class
```typescript
@Injectable()
export class CatsService {
  constructor(private moduleRef: ModuleRef) {}
}
```


## Global Modules
- 전역 모듈은, 모든 곳에 import 되는 모듈을 한 번에 등록하기 위해 사용한다.
- Module 데코레이터 앞에 `@Global()`을 붙여주면 된다.

> 정말 필요할 때만 사용하라고 권고

## Dynamic modules

- Nest에서 제공하는 기능. provider를 동적으로 설정하여 module을 커스텀할 수 있다.

```typescript
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```
```
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}
```
```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class AppModule {}
```


---
# Nestjs Study 


```bash
$ npm install
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
