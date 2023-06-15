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
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

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
  create(@Body() createLocationDto: CreateLocationDto) {
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
  findAll(
    @Query('name') name: string,
    @Query('adress') adress: string,
    @Query('city') city: string,
    @Query('complexity') complexity: string,
    @Query('state') state: boolean,
  ) {
    return this.locationsService.findAll(name, adress, city, complexity, state);
  }

  @Get('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of medical centers with pagination',
    description: 'Consultation of registered medical centers with pagination',
  })
  findAllPagination(
    @Query('name') name: string,
    @Query('adress') adress: string,
    @Query('city') city: string,
    @Query('complexity') complexity: string,
    @Query('state') state: boolean,
    @Query('page') page = '0',
    @Query('quantity') quantity = '10',
  ) {
    return this.locationsService.findAllPagination(
      name,
      adress,
      city,
      complexity,
      state,
      +page,
      +quantity,
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
  findOne(@Param('id') id: string) {
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
  ) {
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
  remove(@Param('id') id: string) {
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
  changeState(@Param('id') id: string) {
    return this.locationsService.changeState(+id);
  }
}
