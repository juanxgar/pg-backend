import { ApiProperty } from '@nestjs/swagger';
import { CreateRotationDateDto } from './create-rotation-date.dto';

export class CreateRotationDatesDto {
  @ApiProperty()
  rotation_id: number;

  @ApiProperty()
  student_user_id: number;

  @ApiProperty()
  rotation_dates: Array<CreateRotationDateDto>;
}
