import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationSpecialityDto {
  
  @ApiProperty()
  speciality_id: number;

  @ApiProperty()
  location_id: number;

  @ApiProperty()
  limit_capacity: number;
}
