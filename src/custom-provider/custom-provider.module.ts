import { Module, Scope } from '@nestjs/common';
// import { CustomProviderService } from './custom-provider.service';
import { CustomProviderController } from './custom-provider.controller';
import * as winston from 'winston';
import { CustomProviderService } from './custom-provider.service';
import { LEVEL } from 'triple-beam';
import { CustomProviderAsyncService } from './custom-provider.async.service';

const mockCustomProviderService = {
  findAll: () => {
    console.log('This is mocking service test');
  },
};

const { combine, timestamp, label, printf } = winston.format;
const logFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    label({ label: 'Winston Use Value' }),
    logFormat,
  ),
  transports: [new winston.transports.Console()],
});

const AsyncProvider = {
  provide: 'FACTORY_PROVIDER_TEST',
  useFactory: async (
    customProviderAsyncService: CustomProviderAsyncService,
  ): Promise<string> => {
    const { content: data } = await customProviderAsyncService.asyncTest();
    console.log('Before Injection::', data);
    return data;
  },
  inject: [CustomProviderAsyncService],
  // scope: Scope.TRANSIENT,
};

@Module({
  controllers: [CustomProviderController],
  providers: [
    {
      provide: CustomProviderService,
      useValue: mockCustomProviderService,
    },
    {
      provide: 'Logger',
      useValue: logger,
    },
    CustomProviderAsyncService,
    AsyncProvider,
  ],
})
export class CustomProviderModule {}
