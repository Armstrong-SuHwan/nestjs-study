import { Injectable, Scope } from '@nestjs/common';
import { ScopeLoggerService } from './scope.logger.service';

// @Injectable({ scope: Scope.REQUEST, durable: true })
@Injectable({ scope: Scope.REQUEST })
export class ScopeRequestService {
  constructor(private readonly loggerService: ScopeLoggerService) {
    console.log(Date.now());
  }

  testLogger(): void {
    this.loggerService.logMessage('Logger Test');
  }
}
