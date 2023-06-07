import { ApiProperty } from "@nestjs/swagger";
import { CreateGroupDetailDto } from "./create-group-detail.dto";

export class CreateGroupDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    professor_user_id: number;

    @ApiProperty()
    group_detail: Array<CreateGroupDetailDto>
}
