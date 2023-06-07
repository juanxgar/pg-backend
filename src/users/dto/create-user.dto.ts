import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  identification: number;

  @ApiProperty()
  role: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  speciality: string;
}
