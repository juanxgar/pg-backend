import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { AuthController } from './auth.controller';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService, MailService],
      imports: [
        PassportModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_TOKEN,
          signOptions: { expiresIn: '300m' },
        }),
        MailModule,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
