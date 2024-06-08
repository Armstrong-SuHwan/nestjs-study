import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class ScopeLoggerService {
  constructor(@Inject(INQUIRER) private readonly inquirer: any) {}

  logMessage(message: string): void {
    console.log(`[${this.inquirer.constructor.name}] ${message}`);
  }
}
