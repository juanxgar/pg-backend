import { ApiProperty } from '@nestjs/swagger';

export class CreateRotationDateDto {
  @ApiProperty()
  rotation_speciality_id: number;

  @ApiProperty()
  available_capacity: number;

  @ApiProperty()
  start_date: string;

  @ApiProperty()
  finish_date: string;
}
