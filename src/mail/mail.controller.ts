import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { user } from '@prisma/client';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('reset_password')
  async sendEmail(@Body() user: user) {
    return await this.mailService.resetPasswordEmail(user);
  }
}
