import { Injectable } from '@nestjs/common';
import { ScopeLoggerService } from './scope.logger.service';

@Injectable()
export class ScopeAnotherService {
  constructor(private readonly loggerService: ScopeLoggerService) {}

  testLogger(): void {
    this.loggerService.logMessage('Logger Test');
  }
}
