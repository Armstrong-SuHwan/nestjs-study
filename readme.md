# Logging: 애플리케이션의 동작 기록

## 로그 사용의 목적?

* 이슈 발생 시 빠른 해결을 위하여
* 유저의 사용 패턴을 분석하기 위하여

## 내장로거

내장 로거 클래스는 `@nest/common` 패키지로 제공된다.

- 로깅 비활성화
- 로그 레벨 지정
- 로거의 타임스탬프 재정의
- 오버라이딩
- 기본 로거 확장 -> 커스텀
- 의존성 주입을 통해 로거 주입 및 테스트 모듈로 제공

---
내장 로거의 인스턴스는 로그를 남기고자 하는 부분에서 직접 생성하여 사용할 수 있다.

```typescript
@Injectable()
export class AppService {
  constructor(private myLogger: MyLogger) { }

  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.printDefaultLogs();

    return 'Hello World!';
  }

  private printDefaultLogs() {
    this.logger.error('level: error');
    this.logger.warn('level: warn');
    this.logger.log('level: log');
    this.logger.verbose('level: verbose');
    this.logger.debug('level: debug');
  }
}
```

``` sh
[Nest] 10932  - 07/09/2024, 2:45:38 AM   ERROR level: error
[Nest] 10932  - 07/09/2024, 2:45:38 AM    WARN level: warn
[Nest] 10932  - 07/09/2024, 2:45:38 AM     LOG level: log
[Nest] 10932  - 07/09/2024, 2:45:38 AM VERBOSE level: verbose
[Nest] 10932  - 07/09/2024, 2:45:38 AM   DEBUG level: debug
```

#### 로그 비활성화
``` typescript
const app = await NestFactory.create(AppModule, {
    logger: false
  });
```

#### 로그 레벨 지정

``` typescript
const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'verbose', 'debug']
  });
```

#### 커스텀 로거
``` typescript
export class MyLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
  error(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
  warn(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
  debug?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
}
```

``` sh
level: error
level: warn
level: log
level: verbose
level: debug
```

- ConsoleLogger 상속 받기
``` typescript
export class MyLogger extends ConsoleLogger {
  log(message: any, stack?: string, context?: string) {
    super.log.apply(this, arguments);
    this.doSomething();
  }
  error(message: any, stack?: string, context?: string){
    this.doSomething();
    super.error.apply(this, arguments);
  }

  private doSomething() {
    // 여기에 로깅에 관련된 부가 로직을 추가합니다.
    // ex. DB에 저장
    console.error("MYLOGGER!");    
  }
}
```

- 커스텀 로거 주입
``` typescript
import { Module } from '@nestjs/common';
import { MyLogger } from './my-logger.service';

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule { }
```
``` typescript
import { LoggerModule } from './logging/logger.module';

@Module({
  imports: [LoggerModule],
  ...
})
export class AppModule { }
```
``` typescript
import { MyLogger } from './logging/my-logger.service';

@Injectable()
export class AppService {
  constructor(private myLogger: MyLogger) { }
  private readonly myLogger = new MyLogger();

  getHello(): string {
    this.printMyLogs();

    return 'Hello World!';
  }

  private printMyLogs() {
    this.myLogger.error('level: error');
    this.myLogger.warn('level: warn');
    this.myLogger.log('level: log');
    this.myLogger.verbose('level: verbose');
    this.myLogger.debug('level: debug');
  }
}
```

``` sh
MYLOGGER!
[Nest] 12721  - 07/09/2024, 3:04:21 AM   ERROR level: error
[Nest] 12721  - 07/09/2024, 3:04:21 AM    WARN level: warn
[Nest] 12721  - 07/09/2024, 3:04:21 AM     LOG level: log
MYLOGGER!
[Nest] 12721  - 07/09/2024, 3:04:21 AM VERBOSE level: verbose
[Nest] 12721  - 07/09/2024, 3:04:21 AM   DEBUG level: debug
```

#### 커스텀 로거를 전역으로 사용하기
``` typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(MyLogger));
  await app.listen(3000);
}
```

``` sh
[Nest] 12795  - 07/09/2024, 3:05:47 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12795  - 07/09/2024, 3:05:47 AM     LOG [InstanceLoader] LoggerModule dependencies initialized +21ms
[Nest] 12795  - 07/09/2024, 3:05:47 AM     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 12795  - 07/09/2024, 3:05:47 AM     LOG [RoutesResolver] AppController {/}:
MYLOGGER!
[Nest] 12795  - 07/09/2024, 3:05:47 AM     LOG [RouterExplorer] Mapped {/, GET} route
MYLOGGER!
[Nest] 12795  - 07/09/2024, 3:05:47 AM     LOG [NestApplication] Nest application successfully started
MYLOGGER!
```

---

## 외부 로거

내부 로거가 있는데도 쓰는 이유?

> 콘솔에만 출력하는 것이 아닌, 파일로 저장
>
> 중요한 로그는 데이터 베이스에 저장
>
> 다른 서비스로 전송하기도 (datadog 등)

### winston
