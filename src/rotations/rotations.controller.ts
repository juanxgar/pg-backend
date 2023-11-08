import {
  Controller,
  Get,
  Post,
  Body,
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
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateRotationDatesDto } from './dto/create-rotation-dates.dto';
import {
  DatesRotationDatesResult,
  MessageResult,
  PaginatedResult,
  RotationsOfGroupResult,
} from 'src/types/resultTypes';
import { RotationItem } from 'src/types/entitiesTypes';
import { PaginationDto } from 'src/util/Pagination.dto';

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
  create(@Body() createRotationDto: CreateRotationDto): Promise<MessageResult> {
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
  createRotationDates(
    @Body() createRotationDatesDto: CreateRotationDatesDto,
  ): Promise<MessageResult> {
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
  @ApiQuery({ name: 'group_id', required: false, type: String })
  @ApiQuery({ name: 'location_id', required: false, type: String })
  @ApiQuery({ name: 'start_date', required: false, type: String })
  @ApiQuery({ name: 'finish_date', required: false, type: String })
  @ApiQuery({ name: 'semester', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  findAll(
    @Query('group_id') group_id?: string,
    @Query('location_id') location_id?: string,
    @Query('start_date') start_date?: string,
    @Query('finish_date') finish_date?: string,
    @Query('semester') semester?: string,
    @Query('state') state = 'true',
  ): Promise<Array<RotationItem>> {
    return this.rotationsService.findAll(
      JSON.parse(state),
      +group_id,
      +location_id,
      start_date,
      finish_date,
      +semester,
    );
  }

  @Get('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Rotation consultation with pagination',
    description: 'Consultation of registered rotations with pagination',
  })
  @ApiQuery({ name: 'group_id', required: false, type: String })
  @ApiQuery({ name: 'location_id', required: false, type: String })
  @ApiQuery({ name: 'start_date', required: false, type: String })
  @ApiQuery({ name: 'start_date', required: false, type: String })
  @ApiQuery({ name: 'finish_date', required: false, type: String })
  @ApiQuery({ name: 'semester', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  @ApiQuery({ type: PaginationDto })
  findAllPagination(
    @Query('group_id') group_id?: string,
    @Query('location_id') location_id?: string,
    @Query('start_date') start_date?: string,
    @Query('finish_date') finish_date?: string,
    @Query('semester') semester?: string,
    @Query('state') state = 'true',
    @Query('page') page = '0',
    @Query('limit') limit = '10',
  ): Promise<PaginatedResult<RotationItem>> {
    return this.rotationsService.findAllPagination(
      JSON.parse(state),
      +page,
      +limit,
      +group_id,
      +location_id,
      start_date,
      finish_date,
      +semester,
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
  findOne(@Param('id') id: string): Promise<RotationItem> {
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
  ): Promise<MessageResult> {
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
  remove(@Param('id') id: string): Promise<MessageResult> {
    return this.rotationsService.remove(+id);
  }

  @Get('used-dates-rotation/:locationId')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of used dates',
    description: 'Consultation of used dates of a specific rotation',
  })
  findUsedDatesRotation(
    @Param('locationId') locationId: string,
  ): Promise<Array<DatesRotationDatesResult>> {
    return this.rotationsService.findUsedDatesRotation(+locationId);
  }

  @Get('dates-rotation/:rotationId')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of dates for table of rotations with students',
    description:
      'Consultation of dates of a specific rotation for table of rotatio with student',
  })
  findDatesRotationDates(
    @Param('rotationId') rotationId: string,
  ): Promise<Array<DatesRotationDatesResult>> {
    return this.rotationsService.findDatesRotationDates(+rotationId);
  }

  @Get('/available-capacity')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of capacitity of speciality',
    description:
      'Consultation of avaliable capacity of a speciality in a rotation between specified dates',
  })
  findAvailableCapacity(
    @Query('rotation_speciality_id') rotation_speciality_id: number,
    @Query('start_date') start_date: number,
    @Query('finish_date') finish_date: number,
  ): Promise<number> {
    return this.rotationsService.findAvailableCapacity(
      rotation_speciality_id,
      start_date,
      finish_date,
    );
  }

  @Get('/group/:groupId')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of a rotation by group',
    description: 'Consultation of a rotation by group',
  })
  getRotationsOfGroup(
    @Param('groupId') groupId: string,
  ): Promise<Array<RotationsOfGroupResult>> {
    return this.rotationsService.getRotationsOfGroup(+groupId);
  }

  @Get('/student-dates')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of capacitity of speciality',
    description:
      'Consultation of avaliable capacity of a speciality in a rotation between specified dates',
  })
  getStudentRotationDates(
    @Query('rotationId') rotationId: string,
    @Query('studentId') studentId: string,
  ) {
    return this.rotationsService.getStudentRotationDates(
      +rotationId,
      +studentId,
    );
  }

  @Get('/specialities-dates/:rotationId')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of used dates by specialities of rotation',
    description: 'Consultation of used dates by specialities of a rotation',
  })
  getUsedDatesFromSpecialities(@Param('rotationId') rotationId: string) {
    return this.rotationsService.getUsedDatesFromSpecialities(+rotationId);
  }
}
