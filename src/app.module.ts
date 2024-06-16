import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { EmailService } from './email/email.service';

// TODO. Value Provider 사용 시 주의사항
// import { CustomProviderService } from './custom-provider/custom-provider.service';
//
// const mockCustomProviderService = {
//   findAll: () => {
//     console.log('This is mocking service test');
//   },
// };

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmailService,
  ],
})
export class AppModule {}
