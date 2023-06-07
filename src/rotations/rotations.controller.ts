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
import { RotationsService } from './rotations.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FindRotationsDto } from './dto/find-rotations.dto';
import { CreateRotationDatesDto } from './dto/create-rotation-dates.dto';
import { FindAvailableCapacityDto } from './dto/find-available-capacity.dto';

@ApiBearerAuth()
@ApiTags('Rotations')
@Controller('rotations')
export class RotationsController {
  constructor(private readonly rotationsService: RotationsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Rotation creation',
    description: 'Registration of rotation',
  })
  create(@Body() createRotationDto: CreateRotationDto) {
    return this.rotationsService.create(createRotationDto);
  }

  @Post('/dates')
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Creation of rotation dates',
    description: 'Registration of rotation dates in the database',
  })
  createRotationDates(@Body() createRotationDatesDto: CreateRotationDatesDto) {
    return this.rotationsService.createRotationDates(createRotationDatesDto);
  }

  @Get()
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Rotation consultation',
    description: 'Consultation of registered rotations',
  })
  findAll(@Body() findRotationsDto: FindRotationsDto) {
    return this.rotationsService.findAll(findRotationsDto);
  }

  @Get('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Rotation consultation with pagination',
    description: 'Consultation of registered rotations with pagination',
  })
  findAllPagination(
    @Body() findRotationsDto: FindRotationsDto,
    @Query('page') page = '0',
    @Query('quantity') quantity = '10',
  ) {
    return this.rotationsService.findAllPagination(
      findRotationsDto,
      +page,
      +quantity,
    );
  }

  @Get('/unique/:id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Specific rotation consultation',
    description: 'Consultation of specific rotation',
  })
  findOne(@Param('id') id: string) {
    return this.rotationsService.findOne(+id);
  }

  @Put(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Specific rotation update',
    description: 'Update of a specific rotation in the database',
  })
  update(
    @Param('id') id: string,
    @Body() updateRotationDto: UpdateRotationDto,
  ) {
    return this.rotationsService.update(+id, updateRotationDto);
  }

  @Delete(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Deletion of a specific rotation',
    description:
      'Deletion of a specific rotation in the database based on its id',
  })
  remove(@Param('id') id: string) {
    return this.rotationsService.remove(+id);
  }

  @Get('used-dates-rotation/:locationId')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of used dates',
    description: 'Consultation of used dates of rotation',
  })
  findUsedDatesRotation(@Param('locationId') locationId: string) {
    return this.rotationsService.findUsedDatesRotation(+locationId);
  }
  @Get('dates-rotation/:rotationId')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of dates',
    description: 'Consultation of dates of a specific rotation',
  })
  findDatesRotationDates(@Param('rotationId') rotationId: string) {
    return this.rotationsService.findDatesRotationDates(+rotationId);
  }

  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of capacitity of speciality',
    description:
      'Consultation of avaliable capacity of a speciality in a rotation between specified dates',
  })
  @Post('/available-capacity')
  findAvailableCapacity(
    @Body() findAvailableCapacity: FindAvailableCapacityDto,
  ) {
    return this.rotationsService.findAvailableCapacity(findAvailableCapacity);
  }
}
