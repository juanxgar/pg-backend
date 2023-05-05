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
} from '@nestjs/swagger';

@Controller('specialities')
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Creacion de especialidades',
    description:
      'Registro de especialidades en la base de datos a partir del DTO',
  })
  create(@Body() createSpecialityDto: CreateSpecialityDto) {
    return this.specialitiesService.create(createSpecialityDto);
  }

  @Get()
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consulta de especialidades',
    description: 'Consulta de especialidades registradas',
  })
  findAll(@Query('description') description: string) {
    return this.specialitiesService.findAll(description);
  }

  @Get('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consulta de especialidades con paginación',
    description: 'Consulta de especialidades registradas con paginación',
  })
  findAllPagination(
    @Query('description') description: string,
    @Query('page') page = '0',
    @Query('quantity') quantity = '10',
  ) {
    return this.specialitiesService.findAllPagination(
      description,
      +page,
      +quantity,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialitiesService.findOne(+id);
  }

  @Put(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Actualización de especialidad en específico',
    description:
      'Actualización de especialidad en específico en la base de datos a partir del DTO',
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
    summary: 'Eliminación de especialidad en específico',
    description:
      'Eliminación de especialidad en específico en la base de datos a partir de su id',
  })
  remove(@Param('id') id: string) {
    return this.specialitiesService.remove(+id);
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
    return this.specialitiesService.changeState(+id);
  }
}
