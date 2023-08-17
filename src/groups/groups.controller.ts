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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
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
import {
  MessageResult,
  PaginatedResult,
  StudentsFinishRotationResult,
} from 'src/types/resultTypes';
import { GroupItem } from 'src/types/entitiesTypes';

@ApiBearerAuth()
@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Group creation',
    description:
      'Registration of groups and their students in the database from the DTO',
  })
  create(@Body() createGroupDto: CreateGroupDto): Promise<MessageResult> {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Group consultation',
    description: 'Consultation of registered groups',
  })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'professor_user_id', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  findAll(
    @Query('name') name?: string,
    @Query('professor_user_id') professor_user_id?: string,
    @Query('state') state = 'true',
  ): Promise<Array<GroupItem>> {
    return this.groupsService.findAll(
      JSON.parse(state),
      name,
      +professor_user_id,
    );
  }

  @Get('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Group consultation with pagination',
    description: 'Consultation of registered groups with pagination',
  })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'professor_user_id', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  @ApiQuery({ type: PaginationDto })
  findAllPagination(
    @Query('name') name?: string,
    @Query('professor_user_id') professor_user_id?: string,
    @Query('state') state = 'true',
    @Query('page') page = '0',
    @Query('limit') limit = '10',
  ): Promise<PaginatedResult<GroupItem>> {
    return this.groupsService.findAllPagination(
      JSON.parse(state),
      +page,
      +limit,
      name,
      +professor_user_id,
    );
  }

  @Get('/unique/:id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Specific group consultation',
    description: 'Consultation of specific group',
  })
  findOne(@Param('id') id: string): Promise<GroupItem> {
    return this.groupsService.findOne(+id);
  }

  @Put(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Specific group update',
    description: 'Update of a specific group in the database',
  })
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<MessageResult> {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Deletion of a specific group',
    description: 'Deletion of a specific group in the database based on its id',
  })
  remove(@Param('id') id: string): Promise<MessageResult> {
    return this.groupsService.remove(+id);
  }

  @Patch(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Deactivation/Activation of a specific group',
    description:
      'Deactivation/Activation of a specific group in the database based on its id',
  })
  changeState(@Param('id') id: string): Promise<MessageResult> {
    return this.groupsService.changeState(+id);
  }

  @Get('/students-evaluation')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of students',
    description: 'Consultation of students that finish rotation',
  })
  @ApiQuery({ name: 'speciality_id', required: false, type: String })
  findStudentsFinishRotation(
    @Query('id') id: string,
    @Query('rotation_id') rotation_id: string,
    @Query('speciality_id') speciality_id?: string,
  ): Promise<StudentsFinishRotationResult> {
    return this.groupsService.findStudentsFinishRotation(
      +id,
      +rotation_id,
      +speciality_id,
    );
  }
}
