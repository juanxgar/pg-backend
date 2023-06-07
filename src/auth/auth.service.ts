import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { v4 } from 'uuid';
import { NewPasswordDto } from './dto/new-password.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async signIn(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });
    if (!user) {
      throw new HttpException(
        'Correo electrónico no registrado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const comparePassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!comparePassword) {
      throw new HttpException(
        'Contraseña incorrectos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { email: user.email, user_id: user.user_id };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: resetPasswordDto.email,
      },
    });
    if (!user) {
      throw new HttpException(
        'Correo electrónico no registrado',
        HttpStatus.UNAUTHORIZED,
      );
    }
    user.reset_password_token = v4();
    await this.prisma.user.update({
      where: {
        user_id: user.user_id,
      },
      data: user,
    });

    await this.mailService.resetPasswordEmail(user);

    return {
      message: 'Correo de restablecimiento enviado',
    };
  }

  async newPassword(newPasswordDto: NewPasswordDto) {
    let user = await this.prisma.user.findFirst({
      where: {
        reset_password_token: newPasswordDto.resetPasswordToken,
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(newPasswordDto.password, 10);

    await this.prisma.user.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        password: hashPassword,
        reset_password_token: null,
      },
    });

    return {
      message: 'Contraseña actualizada correctamente',
    };
  }
}
