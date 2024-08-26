## 17.1 클린 아키텍처
어니언 아키텍처에서 발전한 클린 아키텍처는 소프트웨어를 여러 동심원 레이어로 나누고, 각 레이어에 있는 컴포넌트는 안쪽 원에 있는 컴포넌트에만 의존성을 가지도록 하는 구조입니다.

![CleanArchitecture](https://techblog.woowahan.com/wp-content/uploads/img/2019-10-02/the-clean-architecture.png)

### 클린 아키텍처의 주요 개념

1. **계층화된 아키텍처**:

    - 클린 아키텍처는 소프트웨어 시스템을 여러 계층으로 나눕니다. 각 계층은 독립적으로 개발되고 테스트될 수 있으며, 이로 인해 시스템이 더 유연해지고 유지보수가 용이해집니다. 주요 계층은 다음과 같습니다:
        - **엔터프라이즈 비즈니스 규칙 (Entities)**: 비즈니스 도메인의 핵심 규칙을 나타내며, 변경이 거의 없는 계층입니다.
        - **유스케이스 (Use Cases)**: 시스템이 특정 비즈니스 목표를 달성하기 위해 수행해야 하는 작업을 정의합니다.
        - **인터페이스 어댑터 (Interface Adapters)**: 유스케이스와 외부 시스템 간의 상호작용을 담당하며, 프레젠테이션 계층(예: API, UI)을 포함합니다.
        - **프레임워크와 드라이버 (Frameworks & Drivers)**: 외부 기술, 프레임워크, 데이터베이스 등 구체적인 구현이 위치하는 계층입니다.
2. **의존성 규칙 (Dependency Rule)**:

    - 의존성은 항상 외부에서 내부로 향해야 합니다. 즉, 바깥쪽 계층은 안쪽 계층에 의존할 수 있지만, 안쪽 계층은 바깥쪽 계층에 의존해서는 안 됩니다. 이를 통해 핵심 비즈니스 로직이 외부 요소에 의해 영향을 받지 않도록 합니다.
3. **인터페이스와 추상화**:

    - 클린 아키텍처에서는 구체적인 구현 대신 인터페이스와 추상화를 사용하는 것을 권장합니다. 이렇게 하면 비즈니스 로직과 외부 시스템(예: 데이터베이스, UI) 간의 결합도를 낮출 수 있습니다.
4. **테스트 가능성**:

    - 각 계층이 독립적이므로, 특정 계층을 다른 계층과 분리하여 쉽게 테스트할 수 있습니다. 이는 유닛 테스트와 통합 테스트를 쉽게 수행할 수 있도록 도와줍니다.
5. **독립성 유지**:

    - 비즈니스 로직은 외부의 프레임워크, UI, 데이터베이스 기술에 영향을 받지 않도록 독립성을 유지해야 합니다. 이를 통해 기술 스택이 변화하더라도 비즈니스 로직에 대한 영향이 최소화됩니다.

### 클린 아키텍처의 장점

- **유지보수성**: 계층 간의 결합도가 낮아져 유지보수가 용이합니다.
- **확장성**: 새로운 기능 추가 시 기존 시스템에 미치는 영향이 최소화됩니다.
- **테스트 용이성**: 계층이 독립적이므로 테스트가 쉽습니다.
- **변경 용이성**: 기술 스택이나 외부 요건이 변경되어도 시스템의 핵심 로직이 영향을 덜 받습니다.

---

이 책에서는 클린 아키텍처를 레이어 4개로 분류했습니다. 가장 바깥쪽 레이어부터 인프라스트럭처 `Infrastructure`, 인터페이스`Interface`, 애플리케이션`Application`, 도메인`Domain`이라고 명명하겠습니다. 이 이름들이 정해진 바는 없습니다. 필자가 재직 중인 회사에서 붙인 방식으로 직관적으로 이해하기 쉽게 작성한 것일 뿐입니다. 각 레이어에 담당하는 컴포넌트는 다음과 같습니다.

1. **인프라스트럭처 `Infrastructure` 레이어**: 우리가 만드는 애플리케이션에 필요는 하지만 외부에서 가져오는 컴포넌트를 포괄합니다. 예를 들어 데이터베이스, 이메일 전송, 다른 서비스와의 통신 프로토콜 구현체 등 외부에서 제공하는 인터페이스나 라이브러리를 이용하여 우리 서비스에 맞게 구현한 구현체가 포함됩니다.

2. **인터페이스 `Interface` 레이어**: 우리 서비스가 제공하는 인터페이스가 구현되는 레이어입니다. 앞서 학습했던 컨트롤러는 외부에서 들어오는 요청은 어떤 형식이든지 하고 나가는 데이터는 어떠한 방식으로 제공할까. 만약기기로 게이트웨이나 프레젠테와 같은 컴포넌트로 외부와의 인터페이스를 담당하고 있습니다.

3. **애플리케이션 `Application` 레이어**: 애플리케이션의 비즈니스 로직이 구현되는 레이어입니다. 앞서 배웠듯이 연계되어 조작하는 데이터는 우리 서비스의 도메인입니다. 데이터베이스에 데이터를 저장 또는 조회 등의 로직을 구현합니다.

4. **도메인 `Domain` 레이어**: 애플리케이션의 핵심 도메인을 구현하는 레이어입니다. 도메인 레이어는 다른 레이어에 의존하지 않습니다. 따라서 애플리케이션이 가져야 하는 핵심 요소만 가집니다. 만약 도메인 레이어의 컴포넌트가 변경된다면 이를 이용하는 다른 모든 레이어를 수정해야 하므로 신중하게 작성해야 합니다.


클린 아키텍처를 작성하기 위한 또 다른 필수 요소는 DIP(다음 절에서 살펴봅니다)입니다. 각 레이어는 의존성이 안쪽을 향한다고 했습니다. 하지만 구현을 하기 위해서는 안쪽 원에서 바깥쪽 원의 구현체가 필요한 경우가 있습니다. 그러면 구현체가 변경될 경우 함께 수정해야 하므로 독립적이지 않게 됩니다. 특히 인프라 레이어는 다른 것으로 같이 묶이는 경우가 종종 발생합니다. 예를 들어 DB를 MySQL을 사용하다 PostgreSQL로 변경하는 일이 있을 수 있습니다. 이렇게 의존성이 역전되는 경우, 안쪽 레이어에서는 그 레이어 내에서 인터페이스를 정의하고, 인터페이스를 구현한 구현체는 바깥 레이어에 둠으로써 의존성이 역전되지 않도록 할 수 있습니다.

---

더 살펴보기 전에 유사한 다른 아키텍처도 잠시 언급합니다.

### 어니언 아키텍처 (Onion Architecture)

어니언 아키텍처는 클린 아키텍처와 많은 유사점을 가진 아키텍처 스타일 중 하나로, 소프트웨어 시스템을 여러 겹의 "껍질(layers)"로 나누어 설계합니다. 클린 아키텍처와 마찬가지로, 시스템의 핵심 비즈니스 로직을 외부 요소로부터 보호하고 독립성을 유지하려는 목적을 가집니다.

![어니언 아키텍처](https://dz2cdn1.dzone.com/storage/temp/4436217-kolka.png)

어니언 아키텍처의 주요 개념은 다음과 같습니다:

1. **도메인 모델**: 어니언 아키텍처의 중심에는 도메인 모델이 위치하며, 이 모델은 시스템의 핵심 비즈니스 로직과 규칙을 포함합니다. 도메인 모델은 다른 어떤 레이어에도 의존하지 않으며, 외부의 변화에 영향을 받지 않도록 설계됩니다. 이는 클린 아키텍처에서 도메인 레이어의 독립성과 매우 유사합니다.

2. **애플리케이션 서비스**: 이 레이어는 도메인 모델을 이용하여 특정 유스케이스를 구현하는 역할을 합니다. 도메인 모델에 의존하지만, 외부의 인프라나 인터페이스에는 의존하지 않습니다. 클린 아키텍처의 애플리케이션 레이어와 기능적으로 유사합니다.

3. **어댑터**: 외부 시스템과의 연결을 관리하는 레이어입니다. 사용자 인터페이스(UI), 데이터베이스, 외부 API 등 외부와의 상호작용을 처리하는 구현체가 포함됩니다. 이는 클린 아키텍처의 인프라스트럭처 레이어와 같은 역할을 수행합니다.


**클린 아키텍처와의 연관성**: 어니언 아키텍처는 클린 아키텍처의 원칙을 매우 잘 따르며, 특히 의존성 역전 원칙(Dependency Inversion Principle)과 계층 간의 독립성 유지에 중점을 둡니다. 두 아키텍처 모두 핵심 비즈니스 로직을 외부로부터 격리하고, 시스템의 변화에 유연하게 대응할 수 있도록 설계됩니다. 클린 아키텍처의 기본 개념을 실천하는 하나의 구체적인 구현 예시로 볼 수 있습니다.

### 헥사고날 아키텍처 (Hexagonal Architecture)

헥사고날 아키텍처는 "포트와 어댑터 아키텍처(Ports and Adapters Architecture)"라고도 불리며, Alistair Cockburn에 의해 제안되었습니다. 이 아키텍처는 시스템의 내부 도메인 로직이 외부 인터페이스와 독립적으로 동작할 수 있도록 설계되었으며, 특히 시스템의 유연성과 테스트 용이성을 강조합니다.

![헥사고날 아키텍처](https://wata.es/wp-content/uploads/2021/05/diagrama-arquitectura-hexagonal-wata-factory-1024x796.png)

헥사고날 아키텍처의 핵심 요소는 다음과 같습니다:

1. **도메인**: 도메인은 헥사고날 아키텍처에서도 중심에 위치하며, 시스템의 핵심 비즈니스 로직을 포함합니다. 이 도메인은 외부의 어떤 요소에도 의존하지 않으며, 클린 아키텍처에서 강조하는 도메인 레이어와 동일한 개념입니다.

2. **포트(Ports)**: 포트는 시스템의 내부와 외부 간의 상호작용을 위한 인터페이스를 정의하는 레이어입니다. 도메인 로직이 외부 시스템과 상호작용할 때, 이 포트를 통해 인터페이스가 정의되며, 포트는 내부 로직이 외부 환경에 구애받지 않도록 보호합니다.

3. **어댑터(Adapters)**: 어댑터는 포트에서 정의된 인터페이스를 실제로 구현하는 역할을 합니다. 데이터베이스 접근, 메시지 큐, 사용자 인터페이스 등 외부 시스템과의 상호작용을 구체화하는 구현체가 이 레이어에 위치합니다.


**클린 아키텍처와의 연관성**: 헥사고날 아키텍처는 클린 아키텍처의 철학과 밀접하게 연관되어 있습니다. 두 아키텍처 모두 핵심 비즈니스 로직(도메인)을 외부 시스템의 영향을 받지 않도록 보호하며, 외부 의존성을 관리하기 위해 명확한 경계(포트와 어댑터 또는 인터페이스)를 설정합니다. 클린 아키텍처에서 이야기하는 의존성 역전 원칙을 실현하는 또 다른 구체적인 구현 사례로 볼 수 있습니다.


## 17.2 SOLID 객체 지향 설계 원칙

클린 아키텍처의 바탕에는 SOLID라고 불리는 객체 지향 설계 원칙이 깔려 있습니다. SOLID는 로버트 C. 마틴이 정의한 객체 지향 시스템을 설계할 때의 방법론을 체계적으로 정리한 것입니다. SOLID를 적용하면 부수효과가 생기거나 시스템을 수정하는 데 드는 비용이 크게 줄어드는 코드를 작성하도록 가이드합니다. SOLID 각 개념이 서로 분리된 것은 시스템이 쉽게 작동되게 만드는 소프트웨어의 구조적 강점을 갖추게 합니다.

1. **SRP: 단일 책임 원칙 (Single Responsibility Principle)**

   > 한 클래스는 하나의 책임만 가져야 한다.
   - 이 원칙을 다르게 풀어서 설명하면, 클래스를 변경하는 이유는 오직 한 가지뿐이어야 한다. 객체 지향 언어를 배울 때 항상 정해진 내용입니다. 여기서 클래스는 자바를 비롯한 여러 객체 지향 언어에서 말하는 클래스 그 자체를 의미하는 것은 아닙니다. 최소 기능만 담당하게 된다는 개념을 말합니다. 코드를 작성하다 보면 어느새 한 클래스가 비대해지는 경우가 발생하기도 합니다. 만약 클래스 크기가 작고 적은 책임을 가짐으로써 변경에 영향을 받지 않으면 변경 비용이 적어집니다. 커다란 클래스는 다른 클래스와 의존성이 증가하게 되므로 변경 비용이 커지게 됩니다.
```ts
// 나쁜 예시: User 클래스가 데이터베이스 작업과 이메일 발송 책임을 동시에 가짐
class User {
  constructor(public name: string, public email: string) {}

  saveToDatabase() {
    // 데이터베이스에 사용자 정보를 저장하는 로직
  }

  sendEmail() {
    // 사용자에게 이메일을 보내는 로직
  }
}

// 좋은 예시: 각 클래스가 단일 책임을 가짐
class User {
  constructor(public name: string, public email: string) {}
}

class UserRepository {
  save(user: User) {
    // 데이터베이스에 사용자 정보를 저장하는 로직
  }
}

class EmailService {
  sendEmail(user: User) {
    // 사용자에게 이메일을 보내는 로직
  }
}
```

2. **OCP: 개방-폐쇄 원칙 (Open-Closed Principle)**

   > 소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다.
   - 얼핏 들으면 상반된 두 개념이 동시에 존재한다고 느껴질 수 있습니다. 소프트웨어의 요구 사항이 추가되었다고 해서 기존의 소스 코드를 계속 고쳐야 한다면 요구 사항이 늘어날수록 유지 보수가 힘들게 됩니다. 즉, 기능의 추가가 기존 코드에 영향을 끼치지 않도록 하는 구조가 필요합니다. OCP는 인터페이스를 활용하여 쉽게 달성할 수 있습니다. 추가로 필요한 기능이 있다면 인터페이스를 추가하여 구현체를 수정하지 말고 인터페이스에 의존하도록 해야 합니다.
```ts
// 나쁜 예시: 새로운 할인 정책이 추가될 때마다 기존 코드를 수정해야 함
class Discount {
  calculate(price: number, type: string): number {
    if (type === 'student') {
      return price * 0.9;
    } else if (type === 'veteran') {
      return price * 0.8;
    } else {
      return price;
    }
  }
}

// 좋은 예시: 기존 코드를 수정하지 않고 확장할 수 있음
interface Discount {
  calculate(price: number): number;
}

class StudentDiscount implements Discount {
  calculate(price: number): number {
    return price * 0.9;
  }
}

class VeteranDiscount implements Discount {
  calculate(price: number): number {
    return price * 0.8;
  }
}

class DiscountService {
  applyDiscount(price: number, discount: Discount): number {
    return discount.calculate(price);
  }
}

```
3. **LSP: 리스코프 치환 원칙 (Liskov Substitution Principle)**

   > 프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀 수 있어야 한다.
   - 객체 지향 언어가 가지고 있는 강점이 LSP로 발현됩니다. 상속 관계에서, 자식 클래스의 인스턴스는 부모 클래스의 참조 변수로 안전하게 사용할 수 있습니다. 이는 클래스뿐만 아니라 인터페이스를 구현한 클래스에서도 마찬가지입니다. 실제 동작하는 인스턴스는 인터페이스가 제공하는 기능을 구현한 객체이므로 인터페이스를 사용하려는 다른 객체에도 영향을 주지 않습니다. 따라서 설계 구현자인 객체가 자신의 인스턴스를 부모 또는 인터페이스가 제공해야 하는 기능을 제공하는 다른 구현체로 바꿀 수 있습니다.
```ts
// 나쁜 예시: 리스코프 치환 원칙을 위반하는 예
class Rectangle {
  constructor(public width: number, public height: number) {}

  area(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(size: number) {
    super(size, size);
  }
}

// 좋은 예시: 상위 클래스의 역할을 서브클래스가 대체 가능
interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}

  area(): number {
    return this.width * this.height;
  }
}

class Circle implements Shape {
  constructor(public radius: number) {}

  area(): number {
    return Math.PI * this.radius * this.radius;
  }
}

```
4. **ISP: 인터페이스 분리 원칙 (Interface Segregation Principle)**

   > 특정 클라이언트를 위한 인터페이스 여러 개가 범용 인터페이스 하나보다 낫다.
   - 앞서 설명했듯이 코드에서 역할이 달라진다면 인터페이스에 기능이 추가될 때 인터페이스를 구현한 모든 클래스는 수정해야 합니다. 이를 방지하기 위해 인터페이스는 기능별로 잘게 쪼개 역할이 동일한 클래스에만 인터페이스를 추가합니다. 하나의 큰 인터페이스를 만들기보다는 작은 인터페이스로 분리하는 것이 이상적인 방법입니다. 이렇게 하면 인터페이스로 묶인 상속 관계에 대한 변경에 의존성을 낮추고 확장에 대처할 수 있는 방법입니다.
```ts
// 나쁜 예시: 모든 클라이언트가 모든 메서드를 구현해야 함
interface Worker {
  work(): void;
  eat(): void;
}

class Developer implements Worker {
  work(): void {
    console.log('개발 작업을 합니다.');
  }
  
  eat(): void {
    console.log('점심을 먹습니다.');
  }
}

class Robot implements Worker {
  work(): void {
    console.log('로봇이 작업을 수행합니다.');
  }
  
  eat(): void {
    // 로봇은 먹지 않지만 이 메서드를 구현해야 함
    throw new Error('로봇은 먹지 않습니다.');
  }
}

// 좋은 예시: 인터페이스를 분리하여 필요한 것만 구현
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

class Developer implements Workable, Eatable {
  work(): void {
    console.log('개발 작업을 합니다.');
  }
  
  eat(): void {
    console.log('점심을 먹습니다.');
  }
}

class Robot implements Workable {
  work(): void {
    console.log('로봇이 작업을 수행합니다.');
  }
}

```
5. **DIP: 의존관계 역전 원칙 (Dependency Inversion Principle)**

   > 프로그램에서는 추상화에 의존해야지, 구체화에 의존하면 안 된다.
   - DIP는 6장의 추상에 들어서 소개한 DI와 매우 밀접한 관계를 가지고 있습니다. 클린 아키텍처를 구현하기 위해서는 의존관계 역전이 발생하지 않도록 이룩하기 위해 DI를 이용해야 합니다. DI는 보통 프레임워크에서 제공하며, 혹은 DI를 구현할 수 있는 라이브러리를 이용합니다.
```ts
// 나쁜 예시: 구체적인 구현 클래스에 의존하는 상위 모듈
class MySQLDatabase {
  connect() {
    console.log('MySQL 데이터베이스에 연결합니다.');
  }
}

class Application {
  private db: MySQLDatabase;

  constructor() {
    this.db = new MySQLDatabase();
  }

  start() {
    this.db.connect();
  }
}

// 좋은 예시: 인터페이스에 의존하게 하여 유연성 제공
interface Database {
  connect(): void;
}

class MySQLDatabase implements Database {
  connect() {
    console.log('MySQL 데이터베이스에 연결합니다.');
  }
}

class PostgreSQLDatabase implements Database {
  connect() {
    console.log('PostgreSQL 데이터베이스에 연결합니다.');
  }
}

class Application {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  start() {
    this.db.connect();
  }
}

// 애플리케이션을 실행할 때 원하는 데이터베이스 구현체를 주입하여 유연하게 변경 가능
const mySQLDatabase = new MySQLDatabase();
const app = new Application(mySQLDatabase);
app.start();

```
이상으로 SOLID 개념에 대해 알아봤습니다. 그러면 도대체 어느 정도의 해상도로 SOLID를 구현해야 할까요? 클래스와 인터페이스는 어느 정도로 잘게 나누고, 역할을 분리해야 할까요? 그것은 정해진 바가 없습니다. 시스템 변경에 따라 영향을 받는 낮추고 응집도는 높이는 방향으로 끊임없이 리팩터링해서 달성해야 합니다. 만약 여러분의 코드에서 불쾌한 냄새(code smell)가 난다면 언제든지 리팩터링을 할 준비를 해야 할 것입니다.

*주의: SOLID 원칙은 주로 비즈니스 도메인 클래스에 초점을 맞추며, 객체 지향 설계의 핵심 원칙들을 따릅니다.
클린 아키텍처는 시스템 전체의 구조에 대한 이야기이며, 레이어 간의 명확한 분리와 의존성 관리에 중점을 둡니다.*


---

## 17.3 유저 서비스에 클린 아키텍처 적용하기

지금까지 우리는 레이어를 명확하게 구분하지 않았습니다. 기능별 역할에 따라 UsersModule, ExceptionModule, LoggingModule과 같이 모듈로 분리했습니다. 각 모듈은 모든 모듈이 사용할 수 있는 공통 모듈일 수도 있고, MSA의 관점에서 완전히 분리하여 별개의 백엔드 서비스 시스템으로 만들 수도 있습니다. 예를 들어 EmailModule을 물리적으로 다른 환경에서 운용되는 EmailService로 분리할 수도 있습니다. 이제 우리가 작성하고 있는 유저 서비스에서 유저 모듈을 그 범위를 좁혀 클린 아키텍처를 적용한 내용을 정리해보겠습니다.

먼저 다음과 같이 앞에서 이야기한 클린 아키텍처의 4개의 레이어와 모든 레이어에서 공통으로 사용할 컴포넌트를 작성할 common 디렉터리를 만듭니다.

```text
src/users
│
├── application
├── common
├── domain
├── infra
└── interface
```
가장 안쪽 레이어인 domain 레이어에는 도메인 객체와 그 도메인 객체의 상태 변화에 따라 발생되는 이벤트가 존재합니다. 지금 UsersModule이 가지고 있는 도메인 객체는 User 하나밖에 없습니다. DDD를 적용한다면 User가 유저 도메인의 핵심 애그리거트(aggregate)가 됩니다. DDD는 이 책에 설명하기엔 너무 양이 방대하므로 다른 자료를 통해 학습해보세요.
```ts
export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private signupVerifyToken: string,
  ) {}
}
```

User 객체를 생성할 때 "유저가 생성되었습니다"라는 UserCreatedEvent를 발송해야 합니다. 이 도메인 이벤트를 발송하는 주체는 User의 생성자가 되는 게 적당합니다. 하지만 User 클래스는 new 키워드로 생성해야 하는데 EventBus를 주입받을 수가 없습니다. 그래서 User를 생성하는 팩터리 클래스인 UserFactory를 이용하고 이를 프로바이더로 제공합니다.
```ts
import { UserFactory } from './domain/user.factory';
...
@Module({
  ...
  providers: [
    UserFactory,
  ],
})
export class UsersModule {}

import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { UserCreatedEvent } from './user-created.event';
import { User } from './user';

@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) {}

  create(
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): User {
    const user = new User(id, name, email, password, signupVerifyToken);

    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));

    return user;
  }
}

```
1. EventBus를 주입합니다.
2. 유저 객체를 생성하는 create 함수를 제공합니다.
3. 유저 객체를 생성하고 UserCreatedEvent를 발행합니다. 생성한 유저 도메인 객체를 리턴합니다.



`UserCreatedEvent`는 도메인 로직과 밀접한 관계가 있기 때문에 역시 domain 디렉터리로 이동시킵니다. 이제 domain 디렉터리는 다음과 같이 구성되었습니다.

```text
src/users/domain
│
├── cqrs-event.ts
├── repository
│   └── iuser.repository.ts
├── user-created.event.ts
├── user.factory.ts
└── user.ts

```
다음으로 비즈니스 로직이 구현되는 application 레이어를 만들어봅시다. UserCreatedEvent를 처리하는 UserEventsHandler를 리팩터링합니다. TestEvent 처리 부분은 딱히 필요하지 않으므로 삭제하고, 변경된 소스 경로로 맞춰주면 됩니다. 마지막으로 소스 코드를 application 디렉터리로 이동시킵니다.

```ts
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from 'src/email/email.service';
import { UserCreatedEvent } from 'src/users/domain/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    private emailService: EmailService,
  ) {}

  async handle(event: UserCreatedEvent) {
    switch (event.name) {
      case UserCreatedEvent.name: {
        console.log('UserCreatedEvent!');
        const { email, signupVerifyToken } = event as UserCreatedEvent;
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
        break;
      }
      default:
        break;
    }
  }
}

```

커맨드 핸들러도 application 레이어에 존재하는 것이 좋겠습니다. 커맨드와 이벤트 소스들을 따로 관리하고 싶다면 커맨드와 이벤트 디렉터리를 별도로 만드는 것도 좋습니다. 커맨드 핸들러를 모두 이동했으며 쿼리 로직도 application 레이어에서 수행하도록 이동시킵니다. 이제 application 디렉터리는 다음과 같이 됩니다.

```text
src/users/application
│
├── command
│   ├── create-user.command.ts
│   ├── login.command.ts
│   ├── login.handler.ts
│   ├── verify-access-token.command.ts
│   ├── verify-access-token.handler.ts
│   ├── verify-email.command.ts
│   └── verify-email.handler.ts
│
├── event
│   └── user-events.handler.ts
└── query
    ├── get-user-info.handler.ts
    └── get-user-info.query.ts

```

`CreateUserHandler`는 더 이상 직접 `UserCreatedEvent`를 발행하지 않습니다. 관련 소스 코드와 `TestEvent` 발행 부분도 함께 삭제합니다.

interface 레이어를 작성해볼 차례입니다. `UserController`와 관련된 소스 코드가 대상입니다. `UserController`, `UserInfo` 및 DTO 관련 클래스들을 모두 interface 디렉터리로 이동합니다.

```text
src/users/interface
│
├── dto
│   ├── create-user.dto.ts
│   ├── user-login.dto.ts
│   └── verify-email.dto.ts
├── users.controller.ts
└── UserInfo.ts

```

가장 바깥쪽에 있는 infra 레이어는 유저 모듈에서 가져다 쓰는 외부의 컴포넌트가 포함되도록 합니다. 데이터베이스와 이메일 관련 코드가 그 대상입니다. 먼저 엔티티 클래스는 `infra/db/entity` 디렉터리로 이동합니다.

`UserEntity` 클래스는 infra 레이어에 존재하지만 모두 application 레이어에 있는 핸들러가 사용하고 있습니다. 의존성이 반향이 반대로 되어 있지 않습니까? DIP를 적용해서 의존관계를 바로잡겠습니다. 먼저 데이터베이스의 유저 정보를 다루는 인터페이스인 `IUserRepository`를 선언합니다. `IUserRepository`는 현재는 application 레이어의 핸들러에서만 필요하지만 어느 레이어에서도 데이터를 다룰 경우가 생길 수 있기 때문에 domain 레이어에 작성합니다.

```ts
import { User } from '../user';

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User | null>;
  save: (
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) => Promise<void>;
}

```
`IUserRepository`의 구현체인 `UserRepository` 클래스는 infra 레이어에서 구현합니다.

```ts
import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user';
import { IUserRepository } from '../domain/repository/iuser.repository';
import { UserFactory } from '../domain/user.factory';
import { UserEntity } from '../infra/db/entity/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private connection: Connection,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
    });

    if (!userEntity) {
      return null;
    }

    const { id, name, signupVerifyToken, password } = userEntity;
    return this.userFactory.reconstitute(id, name, email, signupVerifyToken, password);
  }

  async save(
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.connection.transaction(async manager => {
      const user = new UserEntity();
      user.id = id;
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}

```

1. 인수로 전달된 이메일 주소를 가진 유저를 DB에서 조회합니다. 만약 저장되어 있지 않다면 null을 리턴하고, 존재한다면 유저 도메인 객체를 돌려줍니다.
2. `UserFactory`의 `create` 함수를 호출하여 도메인 객체를 생성하는 로직이 포함되어 있어 재사용할 수 있습니다. 따라서 `reconstitute` 함수를 사용합니다.
3. `CreateUserHandler`에 포함되어 있던 저장 로직을 이관합니다. 유저 도메인 객체에 저장할 id가 필요하기 때문에 인수에 id를 추가하고, 외부에서 전달받도록 했습니다.

이제 다른 레이어에서 `IUserRepository`를 이용해 데이터를 다룰 수 있게 되었습니다. `CreateUserHandler`에 적용해봅시다.

```ts
import * as uuid from 'uuid';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';
import {
  CreateUserCommand,
} from './create-user.command';
import {
  UserFactory,
} from '../domain/user.factory';
import {
  IUserRepository,
} from 'src/users/domain/repository/iuser.repository';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    const user = await this.userRepository.findByEmail(email);
    if (user !== null) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }

    const id = uuid.v1();
    const signupVerifyToken = uuid.v1();

    await this.userRepository.save({
      id,
      name,
      email,
      password,
      signupVerifyToken,
    });

    this.userFactory.create(id, name, email, password, signupVerifyToken);
  }
}

```
- `IUserRepository`는 클래스가 아니기 때문에 의존성 클래스도 주입받을 수 없습니다. 따라서 @Inject 데커레이터와 `UserRepository` 토큰을 이용하여 구체 클래스를 주입받습니다.
- `IUserRepository`가 제공하는 인터페이스를 이용하여 데이터를 조회하고 저장합니다.

```ts
@Module({
  ...
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UsersModule {}

```
UserRepository 프로바이더는 커스텀 프로바이더에서 배웠던 방식으로 주입해야 합니다.

이메일 모듈이 유저 모듈과 강하게 결합돼 있는 것을 인터페이스로 느슨하게 연결해보겠습니다. 이메일 모듈은 유저 모듈의 입장에서는 외부 시스템이기 때문에 infra에 구현체가 존재해야 합니다. 또 이 구현체를 사용하는 곳은 `UserEventsHandler`인데 application 레이어에 존재합니다. 따라서 application 레이어에 `IEmailService`를 정의합니다.

```ts
export interface IEmailService {
  sendMemberJoinVerification: (
    email: string,
    signupVerifyToken: string,
  ) => Promise<void>;
}

```
infra 레이어에 인터페이스의 구현체를 작성합니다.
```ts
import { Injectable } from '@nestjs/common';
import { EmailService as ExternalEmailService } from 'src/email/email.service';
import { IEmailService } from 'src/users/application/adapter/iemail.service';

@Injectable()
export class EmailService implements IEmailService {
  constructor(
    private emailService: ExternalEmailService,
  ) {}

  async sendMemberJoinVerification(
    email: string,
    signupVerifyToken: string,
  ): Promise<void> {
    this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}

```

- EmailModule에 존재하는 EmailService를 ExternalEmailService 타입으로 이름을 바꾸어 가져옵니다.
- EmailModule이 UsersModule과 같은 서비스에 존재하기 때문에 직접 주입받을 수 있습니다. 하지만 MSA를 적용하여 별개의 서비스로 분리했다면 HTTP 등 다른 프로토콜을 이용하여 호출할 것입니다.

이제 `UserEventsHandler`에 `IEmailService`를 주입받아 사용합니다.
```ts
import { IEmailService } from '../adapter/iemail.service';

@EventsHandler(UserCreatedEvent)
export class UserEventsHandler
  implements IEventHandler<UserCreatedEvent> {
  constructor(
    @Inject('EmailService') private emailService: IEmailService,
  ) {}
  ...
}

```
```ts
@Module({
  ...
  providers: [
    {
      provide: 'EmailService',
      useClass: EmailService,
    },
  ],
})
export class UsersModule {}

```

최종 정리된 디렉토리 구조
```text
src/users/
│
├── application
│   ├── adapter
│   │   └── iemail.service.ts
│   ├── command
│   │   ├── create-user.command.ts
│   │   ├── login.command.ts
│   │   ├── login.handler.ts
│   │   ├── verify-access-token.command.ts
│   │   └── verify-access-token.handler.ts
│   ├── event
│   │   └── user-events.handler.ts
│   └── query
│       ├── get-user-info.handler.ts
│       └── get-user-info.query.ts
│
├── domain
│   ├── cqrs-event.ts
│   ├── repository
│   │   └── iuser.repository.ts
│   ├── user-created.event.ts
│   ├── user.factory.ts
│   └── user.ts
│
├── infra
│   ├── adapter
│   │   └── email.service.ts
│   └── db
│       └── entity
│           └── user.entity.ts
│
└── interface
    ├── dto
    │   ├── create-user.dto.ts
    │   ├── user-login.dto.ts
    │   └── verify-email.dto.ts
    ├── users.controller.ts
    └── UserInfo.ts

```