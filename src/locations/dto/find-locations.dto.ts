import { ApiProperty } from '@nestjs/swagger';

export class FindLocationsDto {
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
  state: boolean;
}
