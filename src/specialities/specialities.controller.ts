import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import {
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiAcceptedResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FindSpecialitiesDto } from './dto/find-specilities.dto';

@ApiBearerAuth()
@ApiTags('Specialities')
@Controller('specialities')
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Creation of speciality',
    description:
      'Registration of a speciality based on its DTO',
  })
  create(@Body() createSpecialityDto: CreateSpecialityDto) {
    return this.specialitiesService.create(createSpecialityDto);
  }

  @Get()
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of specialities',
    description: 'Consultation of registered specialities',
  })
  findAll(@Body() findSpecialitiesDto: FindSpecialitiesDto) {
    return this.specialitiesService.findAll(findSpecialitiesDto);
  }

  @Get('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of specialities with pagination',
    description: 'Consultation of registered specialities with pagination',
  })
  findAllPagination(
    @Body() findSpecialitiesDto: FindSpecialitiesDto,
    @Query('page') page = '0',
    @Query('quantity') quantity = '10',
  ) {
    return this.specialitiesService.findAllPagination(
      findSpecialitiesDto,
      +page,
      +quantity,
    );
  }

  @Get(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of a specific speciality',
    description: 'Consultation of a specific speciality based on its id',
  })
  findOne(@Param('id') id: string) {
    return this.specialitiesService.findOne(+id);
  }

  @Put(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Update of a specific speciality',
    description:
      'Upddate of a specific speciality based on its DTO and id',
  })
  update(
    @Param('id') id: string,
    @Body() updateSpecialityDto: UpdateSpecialityDto,
  ) {
    return this.specialitiesService.update(+id, updateSpecialityDto);
  }

  @Delete(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Elimination of a specific specility',
    description:
      'Elimintation of a specific speciality based on its id',
  })
  remove(@Param('id') id: string) {
    return this.specialitiesService.remove(+id);
  }

  @Patch(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Deactivation/Activation of a specific speciality',
    description:
      'Deactivation/Activation of a specific speciality based on its id',
  })
  changeState(@Param('id') id: string) {
    return this.specialitiesService.changeState(+id);
  }
}
