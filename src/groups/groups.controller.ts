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
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

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
  create(@Body() createGroupDto: CreateGroupDto) {
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
  findAll(
    @Query('name') name?: string,
    @Query('professor_user_id') professor_user_id?: string,
  ) {
    return this.groupsService.findAll(name, +professor_user_id);
  }

  @Get('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Group consultation with pagination',
    description: 'Consultation of registered groups with pagination',
  })
  findAllPagination(
    @Query('name') name?: string,
    @Query('professor_user_id') professor_user_id?: string,
    @Query('page') page = '0',
    @Query('quantity') quantity = '10',
  ) {
    return this.groupsService.findAllPagination(
      name,
      +professor_user_id,
      +page,
      +quantity,
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
  findOne(@Param('id') id: string) {
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
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
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
  remove(@Param('id') id: string) {
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
  changeState(@Param('id') id: string) {
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
  findStudentsFinishRotation(
    @Query('id') id: string,
    @Query('rotation_id') rotation_id: string,
    @Query('speciality_id') speciality_id?: string,
  ) {
    return this.groupsService.findStudentsFinishRotation(
      +id,
      +rotation_id,
      +speciality_id,
    );
  }
}
