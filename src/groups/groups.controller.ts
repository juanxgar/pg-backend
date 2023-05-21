import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FindGroupsDto } from './dto/find-groups.dto';
import { ApiAcceptedResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Created Succesfully' })
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
  findAll(@Body() findGroupsDto: FindGroupsDto) {
    return this.groupsService.findAll(findGroupsDto);
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
    @Body() findGroupsDto: FindGroupsDto,
    @Query('page') page = '0',
    @Query('quantity') quantity = '10'
  ) {
    return this.groupsService.findAllPagination(findGroupsDto, +page, +quantity);
  }

  @Get(':id')
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
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Deletion of a specific group',
    description:
      'Deletion of a specific group in the database based on its id',
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
}
