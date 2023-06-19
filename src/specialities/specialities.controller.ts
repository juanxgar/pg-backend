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
  ApiQuery,
} from '@nestjs/swagger';
import { MessageResult, PaginatedResult } from 'src/types/resultTypes';
import { SpecialityItem } from 'src/types/entitiesTypes';
import { PaginationDto } from 'src/util/Pagination.dto';

@ApiBearerAuth()
@ApiTags('Specialities')
@Controller('specialities')
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Creation of speciality',
    description: 'Registration of a speciality based on its DTO',
  })
  create(
    @Body() createSpecialityDto: CreateSpecialityDto,
  ): Promise<MessageResult> {
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
  @ApiQuery({ name: 'description', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  findAll(
    @Query('description') description?: string,
    @Query('state') state = 'true',
  ): Promise<Array<SpecialityItem>> {
    return this.specialitiesService.findAll(JSON.parse(state), description);
  }

  @Get('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of specialities with pagination',
    description: 'Consultation of registered specialities with pagination',
  })
  @ApiQuery({ name: 'description', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  @ApiQuery({ type: PaginationDto })
  findAllPagination(
    @Query('state') state: boolean,
    @Query('page') page = '0',
    @Query('limit') limit = '10',
    @Query('description') description?: string,
  ): Promise<PaginatedResult<SpecialityItem>> {
    return this.specialitiesService.findAllPagination(
      state,
      +page,
      +limit,
      description,
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
  findOne(@Param('id') id: string): Promise<SpecialityItem> {
    return this.specialitiesService.findOne(+id);
  }

  @Put(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Update of a specific speciality',
    description: 'Upddate of a specific speciality based on its DTO and id',
  })
  update(
    @Param('id') id: string,
    @Body() updateSpecialityDto: UpdateSpecialityDto,
  ): Promise<MessageResult> {
    return this.specialitiesService.update(+id, updateSpecialityDto);
  }

  @Delete(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Elimination of a specific specility',
    description: 'Elimintation of a specific speciality based on its id',
  })
  remove(@Param('id') id: string): Promise<MessageResult> {
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
  changeState(@Param('id') id: string): Promise<MessageResult> {
    return this.specialitiesService.changeState(+id);
  }
}
