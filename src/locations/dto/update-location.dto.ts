import { ApiProperty } from '@nestjs/swagger';
import { UpdateLocationSpecialityDto } from './update-location-speciality.dto';
import { CreateLocationSpecialityDto } from './create-location-speciality.dto';

export class UpdateLocationDto {
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
    type: Array<UpdateLocationSpecialityDto>,
    default: [{ speciality_id: 0, limit_capacity: 0 }],
  })
  specialities: Array<UpdateLocationSpecialityDto>;
}
