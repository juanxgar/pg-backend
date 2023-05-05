import { ApiProperty } from '@nestjs/swagger';

export class FindSpecialitiesDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  state: boolean;
}
