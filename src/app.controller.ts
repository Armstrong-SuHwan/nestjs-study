import { Controller, Get, Req } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getDefault(): string {
    return 'Hello World!';
  }

  // 라우트 path 설정
  @Get('hello')
  getHello(): string {
    return 'Hello!';
  }

  // 라우트 path내 와일드카드 사용 방법
  // ?, +, () 정규표현식 가능 // '.', '-' 두 개는 사용 불가
  @Get('wo*ld')
  getWorld(): string {
    return 'World!';
  }

  // 요청 정보 확인
  @Get('req')
  getRequest(@Req() req: Request): string {
    console.log(req);
    return 'Default!';
  }
}
