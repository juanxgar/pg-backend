import { ApiProperty } from '@nestjs/swagger';

export class FindAvailableCapacityDto {
  @ApiProperty()
  rotation_speciality_id: number;

  @ApiProperty()
  start_date: string;

  @ApiProperty()
  finish_date: string;
}
