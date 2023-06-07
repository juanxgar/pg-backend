import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupDetailDto {

    @ApiProperty()
    group_id: number;

    @ApiProperty()
    user_id: number;
}