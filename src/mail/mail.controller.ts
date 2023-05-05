import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('reset_password')
  async sendEmail(@Body() user: any) {
    return await this.mailService.resetPasswordEmail(user);
  }
}
