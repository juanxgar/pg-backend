import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { PrismaService } from 'src/prisma.service';
import { FindSpecialitiesDto } from './dto/find-specilities.dto';

@Injectable()
export class SpecialitiesService {
  constructor(private prisma: PrismaService) { }
  async create(createSpecialityDto: CreateSpecialityDto) {
    const specialityExists = await this.prisma.speciality.findUnique({
      where: {
        description: createSpecialityDto.description,
      },
    });
    if (specialityExists) {
      throw new HttpException(
        'Ya existe una especialidad con esa descripción',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.speciality.create({
      data: {
        description: createSpecialityDto.description,
      },
    });
    return {
      message: 'Especialidad creada satisfactoriamente',
    };
  }

  async findAll(findSpecialitiesDto: FindSpecialitiesDto) {
    return await this.prisma.speciality.findMany({
      where: {
        description: {
          contains: findSpecialitiesDto.description,
          mode: 'insensitive',
        },
        state: findSpecialitiesDto.state,
      },
      orderBy: {
        description: 'asc',
      },
    });
  }

  async findAllPagination(
    findSpecialitiesDto: FindSpecialitiesDto,
    page: number,
    quantity: number,
  ) {
    return await this.prisma.speciality.findMany({
      where: {
        description: {
          contains: findSpecialitiesDto.description,
          mode: 'insensitive',
        },
        state: findSpecialitiesDto.state,
      },
      orderBy: {
        description: 'asc',
      },
      skip: page * quantity,
      take: quantity,
    });
  }

  async findOne(speciality_id: number) {
    const speciality = await this.prisma.speciality.findUnique({
      where: {
        speciality_id,
      },
    });
    if (!speciality) {
      throw new HttpException(
        'Especialidad no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    return speciality;
  }

  async update(
    speciality_id: number,
    updateSpecialityDto: UpdateSpecialityDto,
  ) {
    const speciality = await this.prisma.speciality.findUnique({
      where: {
        speciality_id,
      },
    });
    if (!speciality) {
      throw new HttpException(
        'Especialidad no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateSpecialityDto.description) {
      const specialityByDescription = await this.prisma.speciality.findUnique({
        where: {
          description: updateSpecialityDto.description,
        },
      });
      if (
        specialityByDescription &&
        specialityByDescription.description != speciality.description
      ) {
        throw new HttpException(
          'Especialidad existente con descripción ingresada',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.prisma.speciality.update({
      where: {
        speciality_id,
      },
      data: updateSpecialityDto,
    });

    return {
      message: 'Especialidad actualizada satisfactoriamente',
    };
  }

  async remove(speciality_id: number) {
    const speciality = this.prisma.speciality.findUnique({
      where: {
        speciality_id,
      },
    });
    if (!speciality) {
      throw new HttpException(
        'Especialidad no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.speciality.delete({
      where: {
        speciality_id,
      },
    });
    return {
      message: `Especialidad eliminada correctamente`,
    };
  }

  async changeState(speciality_id: number) {
    let speciality = await this.prisma.speciality.findUnique({
      where: {
        speciality_id,
      },
    });
    if (!speciality) {
      throw new HttpException(
        'Especialidad no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }

    speciality = await this.prisma.speciality.update({
      where: {
        speciality_id,
      },
      data: {
        state: !speciality.state,
      },
    });

    return {
      message:
        'Especialidad ' +
        (speciality.state ? 'habilitada' : 'inhabilitada') +
        ' satisfactoriamente',
    };
  }
}
