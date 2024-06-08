import { Controller, Get } from '@nestjs/common';
import { ScopeService } from './scope.service';
import { ScopeAnotherService } from './scope.another.service';
import { ScopeRequestService } from './scope.request.service';

@Controller('scope')
export class ScopeController {
  constructor(
    private scopeService: ScopeService,
    private scopeAnotherService: ScopeAnotherService,
    private scopeRequestService: ScopeRequestService,
  ) {}

  @Get()
  getTest(): void {
    this.scopeService.testLogger();
    this.scopeAnotherService.testLogger();
  }

  @Get('/request-test')
  getRequestTest(): void {
    this.scopeRequestService.testLogger();
  }
}
