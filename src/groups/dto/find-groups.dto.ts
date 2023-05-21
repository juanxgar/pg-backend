import { ApiProperty } from "@nestjs/swagger";

export class FindGroupsDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    professor_user_id: number;
}