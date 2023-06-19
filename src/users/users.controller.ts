import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
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
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from 'src/util/Pagination.dto';
import { MessageResult, PaginatedResult } from 'src/types/resultTypes';
import { UserItem } from 'src/types/entitiesTypes';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Creation of a user',
    description: 'Registration of users',
  })
  create(@Body() createUser: CreateUserDto): Promise<MessageResult> {
    return this.usersService.create(createUser);
  }

  @Get('/students')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of students',
    description: 'Consultation of registered students',
  })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'identification', required: false, type: String })
  @ApiQuery({ name: 'code', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  findAllStudents(
    @Query('name') name?: string,
    @Query('identification') identification?: string,
    @Query('code') code?: string,
    @Query('email') email?: string,
    @Query('state') state = 'true',
  ): Promise<Array<UserItem>> {
    return this.usersService.findAllStudents(
      JSON.parse(state),
      name,
      +identification,
      code,
      email,
    );
  }

  @Get('/students/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of students with pagination',
    description: 'Consultation of registered students with pagination',
  })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'identification', required: false, type: String })
  @ApiQuery({ name: 'code', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  @ApiQuery({ type: PaginationDto })
  findAllStudentsPagination(
    @Query('name') name?: string,
    @Query('identification') identification?: string,
    @Query('code') code?: string,
    @Query('email') email?: string,
    @Query('state') state = 'true',
    @Query('page') page = '0',
    @Query('limit') limit = '10',
  ): Promise<PaginatedResult<UserItem>> {
    return this.usersService.findAllStudentsPagination(
      +page,
      +limit,
      name,
      +identification,
      code,
      email,
      JSON.parse(state),
    );
  }

  @Get('/professors')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of professors',
    description: 'Consultation of registered professors',
  })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'identification', required: false, type: String })
  @ApiQuery({ name: 'code', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  findAllProfessors(
    @Query('name') name?: string,
    @Query('identification') identification?: string,
    @Query('code') code?: string,
    @Query('email') email?: string,
    @Query('state') state = 'true',
  ): Promise<Array<UserItem>> {
    return this.usersService.findAllProfessors(
      name,
      +identification,
      code,
      email,
      JSON.parse(state),
    );
  }

  @Get('/professors/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of professors with pagination',
    description: 'Consultation of registered professors with pagination',
  })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'identification', required: false, type: String })
  @ApiQuery({ name: 'code', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: Boolean })
  @ApiQuery({ type: PaginationDto })
  findAllPagination(
    @Query('name') name?: string,
    @Query('identification') identification?: string,
    @Query('code') code?: string,
    @Query('email') email?: string,
    @Query('state') state = 'true',
    @Query('page') page = '0',
    @Query('limit') limit = '10',
  ): Promise<PaginatedResult<UserItem>> {
    return this.usersService.findAllProfessorsPagination(
      +page,
      +limit,
      JSON.parse(state),
      name,
      +identification,
      code,
      email,
    );
  }

  @Get('unique/:id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consulting of a specific user',
    description: 'Consultation of a specific user based on its id',
  })
  findOne(@Param('id') id: string): Promise<UserItem> {
    const idUser = Number(id);
    return this.usersService.findOne(idUser);
  }

  @Put(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Update of a specific user',
    description: 'Update of a specific user based on its id',
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<MessageResult> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Elimination of a specific user',
    description: 'Elimination of a specific user based on its id',
  })
  remove(@Param('id') id: string): Promise<MessageResult> {
    return this.usersService.remove(+id);
  }

  @Patch(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Deactivation/Activation of a specific user',
    description: 'Deactivation/Activation of a specific user based on its id',
  })
  changeState(@Param('id') id: string): Promise<MessageResult> {
    return this.usersService.changeState(+id);
  }
}
