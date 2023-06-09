import {
  Body,
  Controller,
  CustomDecorator,
  Patch,
  Post,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ApiAcceptedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { NewPasswordDto } from './dto/new-password.dto';
import { LoginResult, MessageResult } from 'src/types/resultTypes';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): CustomDecorator<string> =>
  SetMetadata(IS_PUBLIC_KEY, true);

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Login',
    description: 'Login to system',
  })
  signIn(@Body() loginDto: LoginDto): Promise<LoginResult> {
    return this.authService.signIn(loginDto);
  }

  @Public()
  @Patch('/reset-password')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Sending of password reset email',
    description: 'sending of password reset email to recover access',
  })
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResult> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Patch('new-password')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Password reset',
    description: 'Creation of new user password',
  })
  newPassword(@Body() newPasswordDto: NewPasswordDto): Promise<MessageResult> {
    return this.authService.newPassword(newPasswordDto);
  }
}
