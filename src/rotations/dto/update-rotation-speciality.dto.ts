import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRotationSpecialityDto } from './create-rotation-speciality.dto';

export class UpdateRotationSpecialityDto extends PartialType(
  CreateRotationSpecialityDto,
) {
  rotation_speciality_id: number;
}
