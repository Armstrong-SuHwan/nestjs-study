# Chatper 3. Controller

## 0. Create Controller
```bash
# Only Controller
$ nest g controller Users

# CRUD Boilerplate
$ nest g resource Users

```
## 0. IoC, DI
- Inversion of Control
- DI

## 1. Routing Mechanism
```bash
$ npm run start:dev
```
- Nest Factory는 NestFactory.create(AppModule)을 호출하여 애플리케이션 인스턴스를 생성
- Nest Application은 생성된 후 모듈을 초기화(모듈, 미들웨어, 라우트 등의 설정)하고 설정을 적용
  - Instance Loader는 모듈 내의 모든 providers 인스턴스를 생성하고, DI 컨테이너에 등록
    - Injector는 각 클래스의 의존성을 주입하여 인스턴스를 생성
  - Routes Resolver는 애플리케이션 내의 모든 컨트롤러를 분석하여 HTTP 라우트를 설정
    - RoutePathFactory는 각 라우트의 경로를 생성
  - Router Explorer는 생성된 라우트를 실제 애플리케이션에 등록 
------- 

## 2. 
## Installation

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
