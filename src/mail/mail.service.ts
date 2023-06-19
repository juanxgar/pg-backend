import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { user } from '@prisma/client';
import { MessageResult } from 'src/types/resultTypes';
import { UserItem } from 'src/types/entitiesTypes';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async resetPasswordEmail(user: UserItem): Promise<MessageResult> {
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
