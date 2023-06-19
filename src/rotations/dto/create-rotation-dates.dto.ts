import { ApiProperty } from '@nestjs/swagger';
import { CreateRotationDateDto } from './create-rotation-date.dto';

export class CreateRotationDatesDto {
  @ApiProperty()
  rotation_id: number;

  @ApiProperty()
  student_user_id: number;

  @ApiProperty({
    type: Array<CreateRotationDateDto>,
    default: {
      rotation_speciality_id: 0,
      start_date: '1970-01-01',
      finish_date: '1970-01-01',
    },
  })
  rotation_dates: Array<CreateRotationDateDto>;
}
