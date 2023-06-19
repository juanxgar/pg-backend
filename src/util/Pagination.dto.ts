import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ default: 0 })
  page: number;

  @ApiProperty({ default: 10 })
  limit: number;
}
