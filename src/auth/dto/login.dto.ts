import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ default: 'prueba@prueba.com' })
  email: string;

  @ApiProperty({ default: 'prueba123' })
  password: string;
}
