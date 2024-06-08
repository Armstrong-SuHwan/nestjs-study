import * as uuid from 'uuid'
import { Inject, Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UserInfoInterface } from './interface/user-info.interface';

@Injectable()
export class UsersService {
  @Inject(EmailService) private readonly emailService: EmailService;

  // constructor(private emailService: UsersService) {
  //
  // }

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(email: string) {
    console.log('Checking user exists');
    return false; //TODO: DB 연동 후 구현
  }

  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    return; //TODO: DB 연동 후 구현
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerificationEmail(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string) {
    console.log('Check Token --> ', signupVerifyToken);

    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리 중인 유저가 있는지 조회 -> 없다면 에러
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
    // throw new Error('Not implemented');
    return `signup_verify_token=${signupVerifyToken}`;
  }

  async login(email: string, password: string) {
    // TODO
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러처리
    // 2. JWT 토큰 발급

    // throw new Error('Not implemented');

    return `token_${email}_${password}`;
  }

  async getUserInfo(userId: string): Promise<UserInfoInterface> {
    console.log('Getting user info in service');
    return { id: userId, name: 'ex', email: 'ex_email' }
  }
}
