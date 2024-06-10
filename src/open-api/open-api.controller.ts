import { Controller, Get, HostParam } from '@nestjs/common';

// 하위 도메인 라우팅
// http://openapi.localhost:3000/
@Controller({ host: 'openapi.localhost' })
export class OpenApiController {
  @Get()
  index(): string {
    return 'Default Open API';
  }
}

// http://v1.openapi.localhost:3000/
@Controller({ host: 'openapj.localhost' })
export class OpenApiWithVersionController {
  @Get()
  index(@HostParam('version') version: string): string {
    return `${version}, Open API`;
  }
}
