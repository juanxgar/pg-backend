import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { PrismaService } from 'src/prisma.service';
import { FindRotationsDto } from './dto/find-rotations.dto';

@Injectable()
export class RotationsService {
  constructor(private prisma: PrismaService) { }
  async create(createRotationDto: CreateRotationDto) {

    let startDate = new Date();
    const startDateSplit = createRotationDto.start_date.split("-");
    startDate.setFullYear(parseInt(startDateSplit[0]), parseInt(startDateSplit[1]) - 1, parseInt(startDateSplit[2]));

    let finishDate = new Date();
    const finishDateSplit = createRotationDto.finish_date.split("-");
    finishDate.setFullYear(parseInt(finishDateSplit[0]), parseInt(finishDateSplit[1]) - 1, parseInt(finishDateSplit[2]));

    const { start_date, finish_date, specialities, ...rest } = createRotationDto;
    const data = { start_date: startDate, finish_date: finishDate, ...rest }

    let rotationAlreadyExists = await this.prisma.rotation.findFirst({
      where: {
        start_date: startDate,
        finish_date: finishDate,
        group_id: createRotationDto.group_id,
      }
    });
    if (rotationAlreadyExists) {
      throw new HttpException(
        'Ya existe una rotación asignada a las fechas y el grupo seleccionado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hasDuplicates = (array: any) => new Set(array).size < array.length;

    const specialitiesId = specialities.map((e) => {
      return e.speciality_id;
    });

    if (hasDuplicates(specialitiesId)) {
      throw new HttpException(
        'Hay elementos repetidos en las especialidades',
        HttpStatus.BAD_REQUEST,
      );
    }

    const rotation = await this.prisma.rotation.create({
      data
    });

    specialities.forEach((e) => {
      e.rotation_id = rotation.rotation_id;
    });

    await this.prisma.rotation_speciality.createMany({
      data: specialities,
    });

    return {
      message: 'Rotación creada satisfactoriamente',
    };
  }

  async findAll(findRotationsDto: FindRotationsDto) {
    return findRotationsDto;
  }

  findOne(id: number) {
    return `This action returns a #${id} rotation`;
  }

  update(id: number, updateRotationDto: UpdateRotationDto) {
    return `This action updates a #${id} rotation`;
  }

  remove(id: number) {
    return `This action removes a #${id} rotation`;
  }
}
