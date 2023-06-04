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
import { RotationsService } from './rotations.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindRotationsDto } from './dto/find-rotations.dto';
import { CreateRotationDatesDto } from './dto/create-rotation-dates.dto';
import { FindAvailableCapacityDto } from './dto/find-available-capacity.dto';

@ApiBearerAuth()
@ApiTags('Rotations')
@Controller('rotations')
export class RotationsController {
  constructor(private readonly rotationsService: RotationsService) {}

  @Post()
  create(@Body() createRotationDto: CreateRotationDto) {
    return this.rotationsService.create(createRotationDto);
  }

  @Post('/dates')
  createRotationDates(@Body() createRotationDatesDto: CreateRotationDatesDto) {
    return this.rotationsService.createRotationDates(createRotationDatesDto);
  }

  @Get()
  findAll(findRotationsDto: FindRotationsDto) {
    return this.rotationsService.findAll(findRotationsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rotationsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRotationDto: UpdateRotationDto,
  ) {
    return this.rotationsService.update(+id, updateRotationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rotationsService.remove(+id);
  }

  @Get('used-dates-rotation/:locationId')
  findUsedDatesRotation(@Param('locationId') locationId: string) {
    return this.rotationsService.findUsedDatesRotation(+locationId);
  }
  @Get('dates-rotation/:rotationId')
  findDatesRotationDates(@Param('rotationId') rotationId: string) {
    return this.rotationsService.findDatesRotationDates(+rotationId);
  }

  @Post('/available-capacity')
  findAvailableCapacity(@Body() findAvailableCapacity: FindAvailableCapacityDto) {
    return this.rotationsService.findAvailableCapacity(findAvailableCapacity);
  }
}
