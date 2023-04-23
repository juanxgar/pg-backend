import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecialityDto {
  @ApiProperty()
  description: string;
}
