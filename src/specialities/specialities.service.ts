import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { PrismaService } from 'src/prisma.service';
import { MessageResult, PaginatedResult } from 'src/types/resultTypes';
import { SpecialityItem } from 'src/types/entitiesTypes';
import { PaginateFunction } from 'src/types/types';
import { paginator } from 'src/util/Paginator';

@Injectable()
export class SpecialitiesService {
  constructor(private prisma: PrismaService) {}
  async create(
    createSpecialityDto: CreateSpecialityDto,
  ): Promise<MessageResult> {
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

  async findAll(
    state: boolean,
    description?: string,
  ): Promise<Array<SpecialityItem>> {
    return await this.prisma.speciality.findMany({
      where: {
        description: {
          contains: description,
          mode: 'insensitive',
        },
        state: state,
      },
      orderBy: {
        description: 'asc',
      },
    });
  }

  async findAllPagination(
    state: boolean,
    page: number,
    limit: number,
    description?: string,
  ): Promise<PaginatedResult<SpecialityItem>> {
    const paginate: PaginateFunction = paginator({});
    return paginate(
      this.prisma.speciality,
      {
        page,
        perPage: limit,
      },
      {
        where: {
          description: {
            contains: description,
            mode: 'insensitive',
          },
          state: state,
        },
        orderBy: {
          description: 'asc',
        },
      },
    );
  }

  async findOne(speciality_id: number): Promise<SpecialityItem> {
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
  ): Promise<MessageResult> {
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

  async remove(speciality_id: number): Promise<MessageResult> {
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

    await this.prisma.speciality.delete({
      where: {
        speciality_id,
      },
    });
    return {
      message: `Especialidad eliminada correctamente`,
    };
  }

  async changeState(speciality_id: number): Promise<MessageResult> {
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
