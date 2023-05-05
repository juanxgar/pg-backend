import { ApiProperty } from '@nestjs/swagger';

export class LocationSpecialityDto {
  @ApiProperty()
  speciality_id: number;

  @ApiProperty()
  limit_capacity: number;
}
