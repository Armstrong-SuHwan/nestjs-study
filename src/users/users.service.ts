import * as uuid from 'uuid';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UserInfoInterface } from './interface/user-info.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  // @Inject(EmailService) private readonly emailService: EmailService;

  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(emailAddress: string) {
    const user = await this.userRepository.findOne({
      where: { email: emailAddress },
    });
    return user !== undefined;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.userRepository.save(user);
    console.log(`Finish save user ${name} with email: ${email}`);
    return;
  }

  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerificationEmail(
      email,
      signupVerifyToken,
    );
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
    return { id: userId, name: 'ex', email: 'ex_email' };
  }
}
