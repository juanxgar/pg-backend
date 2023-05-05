import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FindLocationsDto } from './dto/find-locations.dto';
import { ApiAcceptedResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Creacion de centros médicos',
    description:
      'Registro de centros médicos y sus especialidades en la base de datos a partir del DTO',
  })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consulta de especialidades',
    description: 'Consulta de especialidades registradas',
  })
  findAll(@Body() findLocationDto: FindLocationsDto) {
    return this.locationsService.findAll(findLocationDto);
  }

  @Get('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consulta de centros médicos con paginación',
    description: 'Consulta los centros médicos registrados con paginación',
  })
  findAllPagination(@Body() findLocationDto: FindLocationsDto) {
    return this.locationsService.findAll(findLocationDto);
  }

  @Get(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consulta de centro médico',
    description: 'Consulta de centro médico en específico',
  })
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(+id);
  }

  @Put(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Actualización de centro médico en específico',
    description: 'Actualización de centro médico en específico en la base de datos',
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
    summary: 'Eliminación de centro médico en específico',
    description:
      'Eliminación de centro médico en específico en la base de datos a partir de su id',
  })
  remove(@Param('id') id: string) {
    return this.locationsService.remove(+id);
  }

  @Patch(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Desactivación/Activación de especialidad en específico',
    description:
      'Desactivación/Activacion de especiaidad en específico en la base de datos a partir de su id',
  })
  changeState(@Param('id') id: string) {
    return this.locationsService.changeState(+id);
  }
}
