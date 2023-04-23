import { ApiProperty } from '@nestjs/swagger';

export class NewPasswordDto {
  @ApiProperty()
  resetPasswordToken: string;
  @ApiProperty()
  password: string;
}
