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
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Creation of a user',
    description: 'Registration of users',
  })
  create(@Body() createUser: CreateUserDto) {
    return this.usersService.create(createUser);
  }

  @Post('/all')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of user',
    description: 'Consultation of registered users',
  })
  findAll(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findAll(findUsersDto);
  }

  @Post('/pagination')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consultation of users with pagination',
    description: 'Consultation of registered users with pagination',
  })
  findAllPagination(
    @Body() findUsersDto: FindUsersDto,
    @Query('page') page = '0',
    @Query('quantity') quantity = '10',
  ) {
    return this.usersService.findAllPagination(findUsersDto, +page, +quantity);
  }

  @Get(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Consulting of a specific user',
    description: 'Consultation of a specific user based on its id',
  })
  findOne(@Param('id') id: string) {
    const idUser = Number(id);
    return this.usersService.findOne(idUser);
  }

  @Put(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Update of a specific user',
    description:
      'Update of a specific user based on its id',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Elimination of a specific user',
    description:
      'Elimination of a specific user based on its id',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch(':id')
  @ApiAcceptedResponse({ description: 'OK response' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request for entity' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiOperation({
    summary: 'Deactivation/Activation of a specific user',
    description:
      'Deactivation/Activation of a specific user based on its id',
  })
  changeState(@Param('id') id: string) {
    return this.usersService.changeState(+id);
  }
}
