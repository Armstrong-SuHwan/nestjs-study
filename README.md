<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## 16.1 CQRS 패턴

CQRS 개요

CQRS(Command Query Responsibility Segregation) 패턴은 명령(Command)과 조회(Query) 작업을 분리하여 시스템을 설계하는 방법입니다. 이를 통해 읽기와 쓰기 작업의 관심사를 명확하게 분리할 수 있으며, 각 작업을 별도로 최적화할 수 있습니다.

명령과 조회의 분리:

명령(Command): 시스템의 상태를 변경하는 작업. 예를 들어, 데이터베이스에 새로운 데이터를 삽입하거나 기존 데이터를 수정하는 작업.
조회(Query): 시스템의 상태를 조회하는 작업. 예를 들어, 데이터베이스에서 데이터를 검색하는 작업.
CQRS의 장점:

성능 향상: 읽기와 쓰기 작업을 각각 최적화할 수 있어 시스템 성능을 향상시킬 수 있습니다.
확장성: 읽기와 쓰기 작업을 독립적으로 확장할 수 있어 유연한 확장성을 제공합니다.
보안 및 권한 관리: 읽기와 쓰기 작업에 대해 별도의 보안 및 권한 관리를 적용할 
수 있습니다.


## 16.2 유저 서비스에 CQRS 적용하기 

NestJS에서는 @nestjs/cqrs 패키지를 사용하여 CQRS 패턴을 쉽게 구현할 수 있습니다. 주요 구성 요소는 다음과 같습니다:

Command:

- 명령 객체는 시스템의 상태를 변경하는 작업을 정의합니다.
- Command Handler는 명령 객체를 처리하는 역할을 합니다.

Query:

- 조회 객체는 시스템의 상태를 조회하는 작업을 정의합니다.
- Query Handler는 조회 객체를 처리하는 역할을 합니다.

Event:

- 이벤트 객체는 시스템에서 발생한 중요한 사건을 나타냅니다.
- Event Handler는 이벤트 객체를 처리하고 적절한 조치를 취합니다.

CQRS 패키지 설치

```bash
$ npm install @nestjs/cqrs
```


import CQRS Module 
```bash
# users.module.ts

import { CqrsModule } from '@nestjs/cqrs';
@Module({
  imports: [
    CqrsModule,
  ],
```
### 16.2.1 커맨드
유저를 생성 수행하는 커맨드 정의

```bash
import { ICommand } from '@nestjs/cqrs';

export class CreateUserCommand implements ICommand {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) { }
}
```

컨트롤로에서 유저 생성 요청시에, UserService를 호출하지 않고 커맨드 전달하도록 변경
```bash
# users.controller.ts
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('users')
export class UsersController {
  constructor(
    # @nest/cqrs 에서 제공하는 CommandBus 주입
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) { }
@Post()
  create(@Body() createUserDto: CreateUserDto) {

    const { name, email, password } = createUserDto;

    const command = new CreateUserCommand(name, email, password);

    # CreateUserCommand를 전송
    return this.commandBus.execute(command);

    # usersService를 호출하지 않는다..
    //return this.usersService.create(createUserDto);
  }
  ...
}
```

CreateUserCommand를 처러히는 CreateUserHandler 생성
```bash
# create-user.handler.ts
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private dataSource: DataSource,
    private eventBus: EventBus,

    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
  ) { }

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    # UsersService 의 createUser() 에서 수행하던 로직 
  }
```

```bash
# users.module.ts

@Module({
  providers: [
    CreateUserHandler,
  ],
})
```

### 16.2.2 이벤트
회원 가입 시 이메일 전송하는 로직 변경

회원 가입 이벤트 발송 -> 이벤트를 구독하는 모듈에서 이벤트 처리 

```bash
# create-user.handler.ts

  async execute(command: CreateUserCommand) {

    # UserService에서 sendMemberJoinEmail(email, signupVerifyToken) 호출을 아래와 같이 변경
    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
    this.eventBus.publish(new TestEvent());
    
  }
```

```bash
# user-created.event.ts

import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from './cqrs-event';

export class UserCreatedEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly email: string,
    readonly signupVerifyToken: string,
  ) {
    super(UserCreatedEvent.name);
  }
}
```

```bash
# test.event.ts

import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from './cqrs-event';

export class TestEvent extends CqrsEvent implements IEvent {
  constructor(
  ) {
    super(TestEvent.name);
  }
}
```

```bash
# user-events.handler.ts

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from 'src/email/email.service';
import { TestEvent } from './test.event';
import { UserCreatedEvent } from './user-created.event';

# @EventsHandler 여러 이벤트 받아서 처리 가능
@EventsHandler(UserCreatedEvent, TestEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent | TestEvent> {
  constructor(
    private emailService: EmailService,
  ) { }

  async handle(event: UserCreatedEvent | TestEvent) {
    switch (event.name) {
      # 기존 UserSerivce에 회원 가입시 이메일 발송 하던 로직을 여기에서 처리
      case UserCreatedEvent.name: {
        console.log('UserCreatedEvent!');
        const { email, signupVerifyToken } = event as UserCreatedEvent;
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
        break;
      }
      # TestEvent 가 발송되면 여기 처리 
      case TestEvent.name: {
        console.log('TestEvent!');
        break;
      }
      default:
        break;
    }
  }
}
```

```bash
# users.module.ts

@Module({
  providers: [
    UserEventsHandler,
  ],
})
```

### 16.2.3 쿼리 

유저 정보 조회 

Query 클래스 구현
```bash
# get-user-info.query.ts

import { IQuery } from '@nestjs/cqrs';

export class GetUserInfoQuery implements IQuery {
  constructor(
    readonly userId: string,
  ) { }
}
```
QueryHandler 구현
```bash
#get-user-info.handler.ts

import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserInfo } from '../UserInfo';
import { GetUserInfoQuery } from './get-user-info.query';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
  ) { }

  async execute(query: GetUserInfoQuery): Promise<UserInfo> {
    const { userId } = query;

    # User Service에서 호출하던 async getUserInfo(userId: string) 동일
    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
```
```bash
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserInfoQuery } from './query/get-user-info.query';

@Controller('users')
// @UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) { }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    # await this.usersRepository.findOne() 호출대신 Query 호출로 변경
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }

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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
