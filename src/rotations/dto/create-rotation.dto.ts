import { ApiProperty } from '@nestjs/swagger';
import { CreateRotationSpecialityDto } from './create-rotation-speciality.dto';

export class CreateRotationDto {
  @ApiProperty()
  group_id: number;

  @ApiProperty()
  location_id: number;

  @ApiProperty()
  start_date: string;

  @ApiProperty()
  finish_date: string;

  @ApiProperty()
  semester: number;

  @ApiProperty({
    default: [{ speciality_id: 0, professor_user_id: 0, number_weeks: 0 }],
  })
  specialities: Array<CreateRotationSpecialityDto>;
}
