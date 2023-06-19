import { ApiProperty } from '@nestjs/swagger';
import { CreateLocationSpecialityDto } from './create-location-speciality.dto';

export class CreateLocationDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  adress: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  total_capacity: number;

  @ApiProperty()
  complexity: string;

  @ApiProperty({
    type: Array<CreateLocationSpecialityDto>,
    default: [{ speciality_id: 0, limit_capacity: 0 }],
  })
  specialities: Array<CreateLocationSpecialityDto>;
}
