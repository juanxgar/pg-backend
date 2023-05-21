import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindRotationsDto } from './dto/find-rotations.dto';

@ApiBearerAuth()
@ApiTags('Rotations')
@Controller('rotations')
export class RotationsController {
  constructor(private readonly rotationsService: RotationsService) { }

  @Post()
  create(@Body() createRotationDto: CreateRotationDto) {
    return this.rotationsService.create(createRotationDto);
  }

  @Get()
  findAll(findRotationsDto: FindRotationsDto) {
    return this.rotationsService.findAll(findRotationsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rotationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRotationDto: UpdateRotationDto) {
    return this.rotationsService.update(+id, updateRotationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rotationsService.remove(+id);
  }
}
