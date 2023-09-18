import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/util/Pagination.dto';
import { MessageResult, PaginatedResult } from 'src/types/resultTypes';
import { LocationItem, LocationSpecialityItem } from 'src/types/entitiesTypes';

@ApiBearerAuth()
@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Creation of a medical center',
    description:
      'Registration of medical centers and their specialities in the database from the DTO',
  })
  create(@Body() createLocationDto: CreateLocationDto): Promise<MessageResult> {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of medical centers',
    description: 'Consultation of registered medical centers',
  })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'adress', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'complexity', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  findAll(
    @Query('name') name?: string,
    @Query('adress') adress?: string,
    @Query('city') city?: string,
    @Query('complexity') complexity?: string,
    @Query('state') state = 'true',
  ): Promise<Array<LocationItem>> {
    return this.locationsService.findAll(
      JSON.parse(state),
      name,
      adress,
      city,
      complexity,
    );
  }

  @Get('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of medical centers with pagination',
    description: 'Consultation of registered medical centers with pagination',
  })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'adress', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'complexity', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  @ApiQuery({ type: PaginationDto })
  findAllPagination(
    @Query('name') name?: string,
    @Query('adress') adress?: string,
    @Query('city') city?: string,
    @Query('complexity') complexity?: string,
    @Query('state') state = 'true',
    @Query('page') page = '0',
    @Query('limit') limit = '10',
  ): Promise<PaginatedResult<LocationItem>> {
    return this.locationsService.findAllPagination(
      JSON.parse(state),
      +page,
      +limit,
      name,
      adress,
      city,
      complexity,
    );
  }

  @Get('/detail/:id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Location Detail consultation',
    description: 'Consultation of registered location details',
  })
  @ApiQuery({ name: 'description', required: false, type: String })
  findLocationDetail(
    @Param('id') id: string,
    @Query('description') description?: string,
  ): Promise<Array<LocationSpecialityItem>> {
    return this.locationsService.findLocationDetail(+id, description);
  }

  @Get('/detail/pagination/:id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Location Detail consultation with pagination',
    description: 'Consultation of registered location details with pagination',
  })
  @ApiQuery({ name: 'description', required: false, type: String })
  @ApiQuery({ type: PaginationDto })
  findLocationDetailPagination(
    @Param('id') id: string,
    @Query('description') description?: string,
    @Query('page') page = '0',
    @Query('limit') limit = '10',
  ): Promise<PaginatedResult<LocationSpecialityItem>> {
    return this.locationsService.findLocationDetailPagination(
      +page,
      +limit,
      +id,
      description,
    );
  }

  @Get(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of a specific medical center',
    description: 'Consultation of a specific medical center from its id',
  })
  findOne(@Param('id') id: string): Promise<LocationItem> {
    return this.locationsService.findOne(+id);
  }

  @Put(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Update of a specific medical center',
    description: 'update of a specific medical center from its id',
  })
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<MessageResult> {
    return this.locationsService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Elimination of a specific medical center',
    description:
      'Elimination of a specific medical center in the database based on its id',
  })
  remove(@Param('id') id: string): Promise<MessageResult> {
    return this.locationsService.remove(+id);
  }

  @Patch(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Deactivation/Activation of a specific medical center',
    description:
      'Deactivation/Activation of a specific medical center in the database based on its id',
  })
  changeState(@Param('id') id: string): Promise<MessageResult> {
    return this.locationsService.changeState(+id);
  }
}
