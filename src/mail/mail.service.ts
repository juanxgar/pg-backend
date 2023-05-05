import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { user } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async resetPasswordEmail(user: user) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Restablecimiento de contraseña - ${user.name}`,
      template: './resetPassword',
      context: {
        name: user.name,
        lastname: user.lastname,
        resetPasswordToken: user.reset_password_token,
      },
    });

    return {
      message: 'Correo enviado satisfactoriamente',
    };
  }
}
