import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { EmailService } from './email/email.service';
import { ScopeController } from './scope/scope.controller';
import { ScopeService } from './scope/scope.service';
import { ScopeLoggerService } from './scope/scope.logger.service';
import { ScopeAnotherService } from './scope/scope.another.service';
import { CustomProviderModule } from './custom-provider/custom-provider.module';
import { ScopeRequestService } from './scope/scope.request.service';

// TODO. Value Provider 사용 시 주의사항
// import { CustomProviderService } from './custom-provider/custom-provider.service';
//
// const mockCustomProviderService = {
//   findAll: () => {
//     console.log('This is mocking service test');
//   },
// };

@Module({
  imports: [CustomProviderModule],
  controllers: [UsersController, ScopeController],
  providers: [
    UsersService,
    EmailService,
    ScopeService,
    ScopeLoggerService,
    ScopeAnotherService,
    ScopeRequestService,
    // {
    //   provide: CustomProviderService,
    //   useValue: mockCustomProviderService,
    // },
  ],
})
export class AppModule {}
