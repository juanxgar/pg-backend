import { ApiProperty } from '@nestjs/swagger';
import { UpdateLocationSpecialityDto } from './update-location-speciality.dto';

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

  @ApiProperty()
  specialities: Array<UpdateLocationSpecialityDto>;
}
