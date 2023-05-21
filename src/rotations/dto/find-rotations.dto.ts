import { ApiProperty } from '@nestjs/swagger';

export class FindRotationsDto {

    @ApiProperty()
    group_id: number;

    @ApiProperty()
    location_id: number;

    @ApiProperty()
    start_date: string;

    @ApiProperty()
    finish_date: string;

    @ApiProperty()
    semester: number;

    @ApiProperty()
    state: boolean;

}