import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'YOUR_GMAIL',
        pass: 'YOUR_PASSWORD',
      },
    });
  }

  async sendMemberJoinVerificationEmail(
    emailAddress: string,
    signupVerifyToken: string,
  ): Promise<void> {
    const baseUrl = 'http://localhost:3000';

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        가입확인 버튼을 누르시면 가입 인증 완료
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
