import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLocationSpecialityDto } from './create-location-speciality.dto';

export class UpdateLocationSpecialityDto extends PartialType(CreateLocationSpecialityDto) {

    @ApiProperty()
    location_speciality_id: number;
}