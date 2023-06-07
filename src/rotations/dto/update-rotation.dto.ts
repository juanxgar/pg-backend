import { ApiProperty } from '@nestjs/swagger';
import { UpdateRotationSpecialityDto } from './update-rotation-speciality.dto';

export class UpdateRotationDto {
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

  @ApiProperty({ default: [{ speciality_id: 0, professor_user_id: 0 }] })
  specialities: Array<UpdateRotationSpecialityDto>;
}
