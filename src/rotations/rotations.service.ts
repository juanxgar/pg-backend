import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { PrismaService } from 'src/prisma.service';
import { FindRotationsDto } from './dto/find-rotations.dto';
import { CreateRotationDatesDto } from './dto/create-rotation-dates.dto';
import { RotationDates } from 'src/types/types';
import * as moment from 'moment';
import { FindAvailableCapacityDto } from './dto/find-available-capacity.dto';

@Injectable()
export class RotationsService {
  constructor(private prisma: PrismaService) {}

  async create(createRotationDto: CreateRotationDto) {
    const startDate = new Date(createRotationDto.start_date);
    const finishDate = new Date(createRotationDto.finish_date);

    const { start_date, finish_date, specialities, ...rest } =
      createRotationDto;
    const data = { start_date: startDate, finish_date: finishDate, ...rest };

    let rotationAlreadyExists = await this.prisma.rotation.findFirst({
      where: {
        location_id: createRotationDto.location_id,
        group_id: createRotationDto.group_id,
        start_date: {
          lte: finishDate,
          gte: startDate,
        },
        finish_date: {
          lte: finishDate,
          gte: startDate,
        },
      },
    });
    if (rotationAlreadyExists) {
      throw new HttpException(
        'Ya existe una rotación asignada a las fechas y el grupo seleccionado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hasDuplicates = (array: number[]) =>
      new Set(array).size < array.length;

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
      data,
      select: {
        rotation_id: true,
        location: {
          select: {
            location_speciality: {
              select: {
                speciality_id: true,
                limit_capacity: true,
              },
            },
          },
        },
      },
    });

    rotation.location.location_speciality.forEach((e) => {
      const index = specialities.findIndex((v) =>
        v.speciality_id.toString().includes(e.speciality_id.toString()),
      );
      specialities[index].available_capacity = e.limit_capacity;
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

  async createRotationDates(createRotationDatesDto: CreateRotationDatesDto) {
    const rotation = await this.prisma.rotation.findUnique({
      select: {
        rotation_date: {
          select: {
            rotation_date_id: true,
            rotation_speciality_id: true,
            rotation_speciality: true,
            start_date: true,
            finish_date: true,
          },
        },
        rotation_speciality: true,
        group: {
          select: {
            group_detail: true,
          },
        },
      },
      where: {
        rotation_id: createRotationDatesDto.rotation_id,
      },
    });
    if (!rotation) {
      throw new HttpException('Rotación no encontrada', HttpStatus.BAD_REQUEST);
    }

    let studentValidation = false;
    rotation.group.group_detail.forEach((e) => {
      if (e.user_id === createRotationDatesDto.student_user_id) {
        studentValidation = true;
      }
    });
    if (!studentValidation) {
      throw new HttpException(
        'El estudiante no pertenece al grupo de la rotación',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dates = createRotationDatesDto.rotation_dates.map((e) => {
      if (e.available_capacity == 0) {
        throw new HttpException(
          'Hay especialidades a fechas asignadas que no tiene cupo disponible',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        student_user_id: createRotationDatesDto.student_user_id,
        rotation_id: createRotationDatesDto.rotation_id,
        rotation_speciality_id: e.rotation_speciality_id,
        start_date: new Date(e.start_date),
        finish_date: new Date(e.finish_date),
      };
    });

    await this.prisma.rotation_date.createMany({
      data: dates,
    });

    return {
      message:
        'Fechas de rotación para el estudiante creadas satisfactoriamente',
    };
  }

  async findAll(findRotationsDto: FindRotationsDto) {
    return await this.prisma.rotation.findMany({
      select: {
        rotation_id: true,
        finish_date: true,
        group: true,
        location: true,
        rotation_speciality: true,
        semester: true,
        start_date: true,
        state: true,
      },
      where: {
        group_id: findRotationsDto.group_id,
        location_id: findRotationsDto.location_id,
        start_date: findRotationsDto.start_date,
        finish_date: findRotationsDto.finish_date,
        semester: findRotationsDto.semester,
        state: findRotationsDto.state,
      },
      orderBy: {
        start_date: 'asc',
      },
    });
  }

  async findAllPagination(
    findRotationsDto: FindRotationsDto,
    page: number,
    quantity: number,
  ) {
    return await this.prisma.rotation.findMany({
      select: {
        rotation_id: true,
        finish_date: true,
        group: true,
        location: true,
        rotation_speciality: true,
        semester: true,
        start_date: true,
        state: true,
      },
      where: {
        group_id: findRotationsDto.group_id,
        location_id: findRotationsDto.location_id,
        start_date: findRotationsDto.start_date,
        finish_date: findRotationsDto.finish_date,
        semester: findRotationsDto.semester,
        state: findRotationsDto.state,
      },
      orderBy: {
        start_date: 'asc',
      },
      skip: page * quantity,
      take: quantity,
    });
  }

  async findOne(rotation_id: number) {
    const rotation = await this.prisma.rotation.findUnique({
      select: {
        rotation_id: true,
        finish_date: true,
        group: true,
        location: true,
        rotation_speciality: true,
        semester: true,
        start_date: true,
        state: true,
      },
      where: {
        rotation_id,
      },
    });
    if (!rotation) {
      throw new HttpException('Rotación no encontrada', HttpStatus.BAD_REQUEST);
    }
    return rotation;
  }

  async update(rotation_id: number, updateRotationDto: UpdateRotationDto) {
    const rotation = await this.prisma.rotation.findUnique({
      select: {
        rotation_id: true,
        finish_date: true,
        group_id: true,
        group: true,
        location_id: true,
        location: true,
        rotation_speciality: true,
        semester: true,
        start_date: true,
        state: true,
        rotation_date: true,
      },
      where: {
        rotation_id,
      },
    });
    if (!rotation) {
      throw new HttpException('Rotación no encontrada', HttpStatus.BAD_REQUEST);
    }

    if (rotation.rotation_date.length > 0) {
      throw new HttpException(
        'Rotación no puede ser actualizada, ya tiene fechas de rotación asignadas a estudiantes',
        HttpStatus.BAD_REQUEST,
      );
    }

    const specialitiesId = rotation.rotation_speciality.map((e) => {
      return e.speciality_id;
    });

    const { specialities, start_date, finish_date, ...rest } =
      updateRotationDto;

    const startDate = new Date(start_date);
    const finishDate = new Date(finish_date);

    const data = { start_date: startDate, finish_date: finishDate, ...rest };

    const specialitiesIdDto = specialities.map((e) => {
      return e.speciality_id;
    });

    const hasDuplicates = (array: number[]) =>
      new Set(array).size < array.length;

    if (hasDuplicates(specialitiesIdDto)) {
      throw new HttpException(
        'Hay elementos repetidos en las especialidades',
        HttpStatus.BAD_REQUEST,
      );
    }

    //Specialities to create
    const specialitiesToCreateFilter = specialities.filter(
      (e) => !specialitiesId.includes(e.speciality_id),
    );
    const specialitiesToCreate = specialitiesToCreateFilter.map((e) => {
      return {
        rotation_id: rotation.rotation_id,
        speciality_id: e.speciality_id,
        professor_user_id: e.professor_user_id,
        available_capacity: e.available_capacity,
        number_weeks: e.number_weeks,
      };
    });
    const specialitiesIdsToCreate = specialitiesToCreate.map((e) => {
      return e.speciality_id;
    });

    //Specialities ids to delete
    const specialitiesIdsToDelete = specialitiesId.filter(
      (e) => !specialitiesIdDto.includes(e),
    );

    //Specialities to update
    const specialitiesToUpdate = specialities.filter(
      (e) =>
        !specialitiesIdsToCreate.includes(e.speciality_id) &&
        !specialitiesIdsToDelete.includes(e.speciality_id),
    );

    //Find by group_id
    let rotationAlreadyExists = await this.prisma.rotation.findFirst({
      where: {
        start_date: rotation.start_date,
        finish_date: rotation.finish_date,
        group_id: updateRotationDto.group_id,
      },
    });
    if (
      rotationAlreadyExists &&
      rotationAlreadyExists.group_id != rotation.group_id
    ) {
      throw new HttpException(
        'El grupo seleccionado ya tiene asignada una rotación en las fechas definidas',
        HttpStatus.BAD_REQUEST,
      );
    }

    //Find by dates
    rotationAlreadyExists = await this.prisma.rotation.findFirst({
      where: {
        group_id: rotation.group_id,
        start_date: startDate,
        finish_date: finishDate,
      },
    });

    if (
      rotationAlreadyExists &&
      rotationAlreadyExists.start_date.toString() !=
        rotation.start_date.toString() &&
      rotationAlreadyExists.finish_date.toString() !=
        rotation.finish_date.toString()
    ) {
      throw new HttpException(
        'El grupo ya tiene asignada una rotación con las fechas seleccionadas',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const e of specialitiesToUpdate) {
      await this.prisma.rotation_speciality.update({
        where: {
          rotation_speciality_id: e.rotation_speciality_id,
        },
        data: {
          professor_user_id: e.professor_user_id,
        },
      });
    }

    if (specialitiesIdsToDelete.length > 0) {
      await this.prisma.rotation_speciality.deleteMany({
        where: {
          rotation_id: rotation.rotation_id,
          speciality_id: {
            in: specialitiesIdsToDelete,
          },
        },
      });
    }

    if (specialitiesToCreate.length > 0) {
      await this.prisma.rotation_speciality.createMany({
        data: specialitiesToCreate,
      });
    }

    await this.prisma.rotation.update({
      where: {
        rotation_id,
      },
      data,
    });

    return {
      message: 'Rotación actualizada satisfactoriamente',
    };
  }

  async remove(rotation_id: number) {
    const rotation = await this.prisma.rotation.findUnique({
      select: {
        rotation_id: true,
        rotation_speciality: {
          select: {
            rotation_speciality_id: true,
            rotation_date: {
              select: {
                rotation_date_id: true,
              },
            },
          },
        },
      },
      where: {
        rotation_id,
      },
    });
    if (!rotation) {
      throw new HttpException('Rotación no encontrada', HttpStatus.BAD_REQUEST);
    }

    const rotationDatesId: Array<number> = [];
    const rotationSpecialitiesId: Array<number> =
      rotation.rotation_speciality.map((e) => {
        e.rotation_date.forEach((e2) => {
          rotationDatesId.push(e2.rotation_date_id);
        });
        return e.rotation_speciality_id;
      });

    if (rotationDatesId.length > 0) {
      await this.prisma.rotation_date.deleteMany({
        where: {
          rotation_date_id: {
            in: rotationDatesId,
          },
        },
      });
    }

    if (rotationSpecialitiesId.length > 0) {
      await this.prisma.rotation_speciality.deleteMany({
        where: {
          rotation_speciality_id: {
            in: rotationSpecialitiesId,
          },
        },
      });
    }

    return {
      message: `Rotación eliminada correctamente`,
    };
  }

  //Dates for Rotation Creation
  async findUsedDatesRotation(location_id: number) {
    const currentDate = new Date();

    return await this.prisma.rotation.findMany({
      select: {
        start_date: true,
        finish_date: true,
      },
      where: {
        location_id,
        OR: [
          {
            start_date: {
              gte: currentDate,
            },
          },
          {
            finish_date: {
              gte: currentDate,
            },
          },
        ],
      },
    });
  }

  //Used for table, similar to Excel sent by Leidy from UCEVA
  async findDatesRotationDates(rotation_id: number) {
    const rotation = await this.prisma.rotation.findUnique({
      select: {
        start_date: true,
        finish_date: true,
        rotation_speciality: true,
      },
      where: {
        rotation_id,
      },
    });
    if (!rotation) {
      throw new HttpException('Rotación no encontrada', HttpStatus.BAD_REQUEST);
    }
    const numberTotalWeeks = Math.round(
      (rotation.finish_date.getTime() - rotation.start_date.getTime()) /
        (7 * 24 * 60 * 60 * 1000),
    );
    const numberSeparatedWeeks = numberTotalWeeks / 2;

    let dates: RotationDates[] = [];
    let auxDate = rotation.start_date;
    for (let i = 0; i < numberSeparatedWeeks; i++) {
      auxDate.setDate(auxDate.getDate() + 1);
      const start = moment(auxDate).format('YYYY-MM-DD');

      auxDate.setDate(auxDate.getDate() + 13);
      const finish = moment(auxDate).format('YYYY-MM-DD');

      dates.push({
        start_date: start,
        finish_date: finish,
      });
    }
    return dates;
  }

  //Used for dates of rotation. To know if there are specialities availables in selected dates
  async findAvailableCapacity(
    findAvailableCapacityDto: FindAvailableCapacityDto,
  ) {
    const usedCapacity = await this.prisma.rotation_date.count({
      where: {
        rotation_speciality_id: findAvailableCapacityDto.rotation_speciality_id,
        start_date: new Date(findAvailableCapacityDto.start_date),
        finish_date: new Date(findAvailableCapacityDto.finish_date),
      },
    });

    const rotationSpeciality = await this.prisma.rotation_speciality.findUnique(
      {
        select: {
          available_capacity: true,
        },
        where: {
          rotation_speciality_id:
            findAvailableCapacityDto.rotation_speciality_id,
        },
      },
    );
    if (!rotationSpeciality) {
      throw new HttpException(
        'Especialidad de rotación no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    const availableCapacity =
      rotationSpeciality.available_capacity - usedCapacity;
    return availableCapacity;
  }
}