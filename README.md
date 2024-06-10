# Chatper 3. Controller

## 0. Create Controller
```bash
# Only Controller
$ nest g co(ntroller) Users

# CRUD Boilerplate
$ nest g resource Users
```
## 0. MVC
![](https://developer.mozilla.org/en-US/docs/Glossary/MVC/model-view-controller-light-blue.png)

> 1. 모델: 데이터 및 비즈니스 로직을 관리합니다. </br>
> 2. 보기: 레이아웃과 표시를 처리합니다. </br>
> 3. __*컨트롤러: 명령을 모델 및 뷰 부분으로 라우팅합니다.*__

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

## 2. Basic Usage
- app.controller.ts   
  - path 설정, path내 와일드카드 사용, request정보 확인
- samples.controller.ts
  - method, params, redirection, status
- open-api.controller.ts
  - subdomain route
- users.controller.ts
  - payload&queryStringParams mapping dto

## 3. Domain Routing
### Domain Hierarchy
- http://kor3.samsung.net/
> kor3 << 하위 도메인 </br>
> samsung << 두 번째 수준의 도메인 </br>
> net <<  상위 도메인 
- http://kor3.samsung.co.kr/
> kor3 << 하위 도메인 (subdomain)  </br>
> samsung << 세 번째 수준의 도메인 (Third-Level Domain) </br>
> co << 두 번째 수준의 도메인 (Second-Level Domain) </br>
> kr <<  상위 도메인 (Top-Level Domain, TLD)
- open-api.controller.ts

## 4. Restful API
- REST: 웹 서비스를 디자인하는 아키텍쳐 패턴을 의미
  - "REpresentatinal State Transfer", 자원과 표현의 상태전달
  - 웹 서비스 설계를 위한 가이드라인
    - Uniform Interface: 리소스 중심적이며, 고유하게 식별하는 식별자
    - Client-Server: 통신 방식 중 하나 (이론적으로 프로토콜에 종속적인 개념X)
    - Stateless
    - Cacheable
    - Layered System
    - Code on Demand (Optional)
- RESTful
  - REST 아키텍쳐를 따르는 웹서비스를 설명하는 용어
  - REST 원칙을 준수하고, 자원을 URI로 표현하고, (보통)HTTP 메서드를 통해 작업을 수행    
    - URI(상위) vs URL ... URN
      - URI: 자원 위치를 알려주기 위한 규약
      - URL: 통합 자원 식별자로 인터넷에 있는 자원을 나타내는 유일한 주소
        - https://example.com: URL이자 URI
        - https://example.com/skin: URL이자 URI 
        - https://example.com/123: URL-https://example.com, URI-전체
          - 위치 식별자: 123
        - https://example.com/one?id=123: URL-https://example.com/one, URI-전체
          - 위치 식별자: ?id=123
- RESTful API
  - RESTful의 웹서비스 구현, API
- REST API 설계의 구체적인 규칙
  - URI는 정보의 자원을 표현해야 한다
  - 자원에 대한 행위는 HTTP Method(GET, PUT, POST, DELETE 등)로 표현한다
  - 슬래시 구분자(/ )는 계층 관계를 나타내는데 사용한다
  - URI 마지막 문자로 슬래시(/ )를 포함하지 않는다
  - URI는 소문자를 사용한다
  - 하이픈(-)은 URI에서 단어를 구분하는 데 사용한다
  - 밑줄(_)은 사용하지 않는다
  - 파일 확장자를 URI에 포함하지 않는다
  - 복수 명사를 사용하여 컬렉션을 표현한다
  - 필터링, 정렬, 페이징을 위한 쿼리 파라미터를 사용한다
  - 자원의 상태를 나타내기 위한 표준 HTTP 상태 코드를 사용한다
    - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses
    - ex) 415 Unsupported Media Type
  - JSON 또는 XML을 일관되게 사용한다
  - 자기 설명적 메시지
  - HATEOAS 원칙 적용

| 리소스                        | POST                   | GET                      | PUT                           | DELETE                       |
|----------------------------|------------------------|--------------------------|-------------------------------|------------------------------|
| /customers                 | 새 고객 만들기         | 모든 고객 검색           | 고객 대량 업데이트            | 모든 고객 제거               |
| /customers/1               | Error                  | 고객 1에 대한 세부 정보 검색 | 고객 1의 세부 정보 업데이트   | 고객 1 제거                  |
| /customers/1/orders (연관관계) | 고객 1에 대한 새 주문 만들기 | 고객 1에 대한 모든 주문 검색 | 고객 1의 주문 대량 업데이트   | 고객 1의 모든 주문 제거      |


- PUT(전체) vs PATCH(부분)
  - put  : idempotnet( 멱등성 )
    - 같은 리소스를 지속 변경
  - patch : x
    - append가 가능해짐
    
> reference
> - https://restfulapi.net/
> - https://learn.microsoft.com/ko-kr/azure/architecture/best-practices/api-design
> - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md

## 5. OOP & Cross-Cutting Concern

------- 

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
