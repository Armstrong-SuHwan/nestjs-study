import { Controller, Get, Inject } from '@nestjs/common';
import { CustomProviderService } from './custom-provider.service';
import { Logger } from 'winston';

@Controller('custom-provider')
export class CustomProviderController {
  constructor(
    private readonly customProviderService: CustomProviderService,
    @Inject('Logger') private readonly logger: Logger,
  ) {}

  @Get()
  getCustomProvider(): void {
    this.customProviderService.findAll();
  }

  @Get('test/logger')
  getTestLogger(): void {
    this.logger.info('Logger Test Finish');
  }
}
