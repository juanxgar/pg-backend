import { ApiProperty } from '@nestjs/swagger';
import { LocationSpecialityDto } from './location-speciality.dto';

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

  @ApiProperty()
  specialities: Array<LocationSpecialityDto>;
}
