import { ApiProperty } from '@nestjs/swagger';

export class CreateRotationSpecialityDto {
  @ApiProperty()
  rotation_id: number;

  @ApiProperty()
  speciality_id: number;

  @ApiProperty()
  professor_user_id: number;

  @ApiProperty()
  available_capacity: number;

  @ApiProperty()
  number_weeks: number;
}
