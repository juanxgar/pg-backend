import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateRotationDatesDto } from './dto/create-rotation-dates.dto';
import { PaginateFunction, RotationDates } from 'src/types/types';
import * as moment from 'moment';
import {
  DatesRotationDatesResult,
  MessageResult,
  PaginatedResult,
  RotationDatesStudents,
  RotationsOfGroupResult,
  StudentRotation,
  UsedRotationDatesBySpeciality,
} from 'src/types/resultTypes';
import { RotationItem } from 'src/types/entitiesTypes';
import { paginator } from 'src/util/Paginator';

@Injectable()
export class RotationsService {
  constructor(private prisma: PrismaService) {}

  async create(createRotationDto: CreateRotationDto): Promise<MessageResult> {
    const startDate = new Date(createRotationDto.start_date);
    const finishDate = new Date(createRotationDto.finish_date);

    const { start_date, finish_date, specialities, ...rest } =
      createRotationDto;
    const data = { start_date: startDate, finish_date: finishDate, ...rest };

    const differenceInTime = finishDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;

    let numberDaysSpecialities = 0;
    specialities.forEach((e) => {
      numberDaysSpecialities = numberDaysSpecialities + e.number_weeks * 7;
    });

    if (numberDaysSpecialities > differenceInDays) {
      const minimumDate = startDate;
      minimumDate.setDate(startDate.getDate() + numberDaysSpecialities);
      let minimumDateString = minimumDate.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      minimumDateString = minimumDateString.replace('/', '-').replace('/', '-');

      throw new HttpException(
        'La fecha mínima de finalización a asignar es ' + minimumDateString,
        HttpStatus.BAD_REQUEST,
      );
    }

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
      let index = -1;
      specialities.forEach((v, i) => {
        if (v.speciality_id.toString().includes(e.speciality_id.toString())) {
          index = i;
        }
      });

      if (index != -1) {
        specialities[index].available_capacity = e.limit_capacity;
      }
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

  async createRotationDates(
    createRotationDatesDto: CreateRotationDatesDto,
  ): Promise<MessageResult> {
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

    const createdDates = await this.prisma.rotation_date.findMany({
      where: {
        rotation_id: createRotationDatesDto.rotation_id,
        student_user_id: createRotationDatesDto.student_user_id,
      },
    });

    if (createdDates.length === 0) {
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

    const rotationSpecialityIds = createRotationDatesDto.rotation_dates.map(
      (e) => {
        return e.rotation_speciality_id;
      },
    );

    let index: number;
    const datesRotationsIds: Array<number> = [];
    const updateDates = createdDates.map((e) => {
      index = rotationSpecialityIds.indexOf(e.rotation_speciality_id);
      datesRotationsIds.push(e.rotation_date_id);
      return {
        rotation_speciality_id:
          createRotationDatesDto.rotation_dates[index].rotation_speciality_id,
        start_date: new Date(
          createRotationDatesDto.rotation_dates[index].start_date,
        ),
        finish_date: new Date(
          createRotationDatesDto.rotation_dates[index].finish_date,
        ),
      };
    });

    let i = 0;
    for (const e of datesRotationsIds) {
      await this.prisma.rotation_date.update({
        where: {
          rotation_date_id: e,
        },
        data: updateDates[i],
      });
      i++;
    }
    return {
      message:
        'Fechas de rotación para el estudiante actualizadas satisfactoriamente',
    };
  }

  async findAll(
    state: boolean,
    group_id?: number,
    location_id?: number,
    start_date?: string,
    finish_date?: string,
    semester?: number,
  ): Promise<Array<RotationItem>> {
    return await this.prisma.rotation.findMany({
      select: {
        rotation_id: true,
        semester: true,
        start_date: true,
        finish_date: true,
        state: true,
        group: {
          select: {
            group_id: true,
            name: true,
            state: true,
            professor_user: true,
          },
        },
        location: true,
      },
      where: {
        group_id: group_id || undefined,
        location_id: location_id || undefined,
        start_date: start_date ? new Date(start_date) : undefined,
        finish_date: finish_date ? new Date(finish_date) : undefined,
        semester: semester || undefined,
      },
      orderBy: {
        start_date: 'asc',
      },
    });
  }

  async findAllPagination(
    state: boolean,
    page: number,
    limit: number,
    group_id?: number,
    location_id?: number,
    start_date?: string,
    finish_date?: string,
    semester?: number,
  ): Promise<PaginatedResult<RotationItem>> {
    const paginate: PaginateFunction = paginator({});
    return paginate(
      this.prisma.rotation,
      {
        page,
        perPage: limit,
      },
      {
        select: {
          rotation_id: true,
          semester: true,
          start_date: true,
          finish_date: true,
          state: true,
          group: {
            select: {
              group_id: true,
              name: true,
              state: true,
              professor_user: true,
            },
          },
          location: true,
        },
        where: {
          group_id: group_id || undefined,
          location_id: location_id || undefined,
          start_date: start_date ? new Date(start_date) : undefined,
          finish_date: finish_date ? new Date(finish_date) : undefined,
          semester: semester || undefined,
          state,
        },
        orderBy: {
          start_date: 'asc',
        },
      },
    );
  }

  async findOne(rotation_id: number): Promise<RotationItem> {
    const rotation = await this.prisma.rotation.findUnique({
      select: {
        rotation_id: true,
        semester: true,
        start_date: true,
        finish_date: true,
        state: true,
        group: {
          select: {
            group_id: true,
            name: true,
            state: true,
            professor_user: true,
          },
        },
        location: true,
        rotation_date: true,
        rotation_speciality: {
          select: {
            rotation_speciality_id: true,
            professor: true,
            speciality: true,
            number_weeks: true,
          },
          orderBy: {
            rotation_speciality_id: 'asc',
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
    return rotation;
  }

  async update(
    rotation_id: number,
    updateRotationDto: UpdateRotationDto,
  ): Promise<MessageResult> {
    const rotation = await this.prisma.rotation.findUnique({
      select: {
        rotation_id: true,
        finish_date: true,
        group_id: true,
        group: true,
        location_id: true,
        location: {
          select: {
            location_id: true,
            name: true,
            adress: true,
            city: true,
            location_speciality: true,
          },
        },
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

    const differenceInTime = finishDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;

    let numberDaysSpecialities = 0;
    specialities.forEach((e) => {
      numberDaysSpecialities = numberDaysSpecialities + e.number_weeks * 7;
    });

    if (numberDaysSpecialities > differenceInDays) {
      const minimumDate = startDate;
      minimumDate.setDate(startDate.getDate() + numberDaysSpecialities);
      let minimumDateString = minimumDate.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      minimumDateString = minimumDateString.replace('/', '-').replace('/', '-');

      throw new HttpException(
        'La fecha mínima de finalización a asignar es ' + minimumDateString,
        HttpStatus.BAD_REQUEST,
      );
    }

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

    rotation.location.location_speciality.forEach((e) => {
      let index = -1;
      specialities.forEach((v, i) => {
        if (v.speciality_id.toString().includes(e.speciality_id.toString())) {
          index = i;
        }
      });

      if (index != -1) {
        specialities[index].available_capacity = e.limit_capacity;
      }
    });

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

  async remove(rotation_id: number): Promise<MessageResult> {
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
    await this.prisma.rotation.delete({
      where: {
        rotation_id,
      },
    });

    return {
      message: `Rotación eliminada correctamente`,
    };
  }

  //Dates for Rotation Creation
  async findUsedDatesRotation(
    location_id: number,
  ): Promise<Array<DatesRotationDatesResult>> {
    const currentDate = new Date();

    const dates = await this.prisma.rotation.findMany({
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

    return dates.map((e) => {
      return {
        start_date: e.start_date
          .toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .replace('/', '-')
          .replace('/', '-'),
        finish_date: e.finish_date
          .toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          .replace('/', '-')
          .replace('/', '-'),
      };
    });
  }

  //Used for table, similar to Excel sent by Leidy from UCEVA
  async findDatesRotationDates(
    rotation_id: number,
  ): Promise<Array<DatesRotationDatesResult>> {
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
    const numberSeparatedWeeks = numberTotalWeeks;

    let dates: RotationDates[] = [];
    let auxDate = rotation.start_date;
    for (let i = 0; i < numberSeparatedWeeks; i++) {
      auxDate.setDate(auxDate.getDate() + 1);
      const start = moment(auxDate).format('YYYY-MM-DD');

      auxDate.setDate(auxDate.getDate() + 6);
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
    rotation_speciality_id: number,
    start_date: number,
    finish_date: number,
  ): Promise<number> {
    const usedCapacity = await this.prisma.rotation_date.count({
      where: {
        rotation_speciality_id,
        start_date: new Date(start_date),
        finish_date: new Date(finish_date),
      },
    });

    const rotationSpeciality = await this.prisma.rotation_speciality.findUnique(
      {
        select: {
          available_capacity: true,
        },
        where: {
          rotation_speciality_id,
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

  async getRotationsOfGroup(
    group_id: number,
  ): Promise<Array<RotationsOfGroupResult>> {
    return this.prisma.rotation.findMany({
      select: {
        rotation_id: true,
        start_date: true,
        finish_date: true,
      },
      where: {
        group_id,
      },
    });
  }

  async getStudentRotationDates(rotation_id: number, student_user_id: number) {
    return this.prisma.rotation_date.findMany({
      select: {
        rotation_id: true,
        rotation_speciality: true,
        start_date: true,
        finish_date: true,
      },
      where: {
        rotation_id,
        student_user_id,
      },
    });
  }

  async getUsedDatesFromSpecialities(
    rotation_id: number,
  ): Promise<Array<UsedRotationDatesBySpeciality>> {
    const rotationSpecialities = await this.prisma.rotation_speciality.findMany(
      {
        select: {
          rotation_speciality_id: true,
          available_capacity: true,
        },
        where: {
          rotation_id,
        },
        orderBy: {
          rotation_speciality_id: 'asc',
        },
      },
    );

    const datesRotation = await this.findDatesRotationDates(rotation_id);

    const usedDates: Array<UsedRotationDatesBySpeciality> = [];
    let countByDateAndSpeciality: number;
    let usedDatesBySpeciality: Array<DatesRotationDatesResult> = [];
    for (let i = 0; i < rotationSpecialities.length; i++) {
      for (let j = 0; j < datesRotation.length; j++) {
        countByDateAndSpeciality = await this.prisma.rotation_date.count({
          where: {
            OR: [
              {
                start_date: new Date(datesRotation[j].start_date),
              },
              {
                finish_date: new Date(datesRotation[j].finish_date),
              },
            ],
            rotation_speciality_id:
              rotationSpecialities[i].rotation_speciality_id,
          },
        });
        if (
          countByDateAndSpeciality >= rotationSpecialities[i].available_capacity
        ) {
          usedDatesBySpeciality.push({
            start_date: moment(datesRotation[j].start_date).format(
              'YYYY-MM-DD',
            ),
            finish_date: moment(datesRotation[j].finish_date).format(
              'YYYY-MM-DD',
            ),
          });
        }
      }
      usedDates.push({
        rotation_speciality_id: rotationSpecialities[i].rotation_speciality_id,
        used_dates: usedDatesBySpeciality,
      });
      usedDatesBySpeciality = [];
    }
    return usedDates;
  }

  //Used in table of rotation dates
  async findUsedDatesRotationDates(
    rotation_id: number,
  ): Promise<Array<StudentRotation>> {
    const rotation = await this.prisma.rotation.findUnique({
      select: {
        rotation_id: true,
        group: {
          select: {
            group_detail: {
              select: {
                user: {
                  select: {
                    user_id: true,
                    name: true,
                    lastname: true,
                    rotation_date: {
                      select: {
                        rotation_date_id: true,
                        rotation_speciality: {
                          select: {
                            speciality: true,
                          },
                        },
                        start_date: true,
                        finish_date: true,
                      },
                      orderBy: {
                        rotation_speciality_id: 'asc',
                      },
                    },
                  },
                },
              },
              orderBy: {
                user: {
                  name: 'asc',
                },
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

    let rotation_dates: Array<RotationDatesStudents>;
    const students: Array<StudentRotation> = rotation.group.group_detail.map(
      (e) => {
        rotation_dates = e.user.rotation_date.map((e2) => {
          return {
            rotation_date_id: e2.rotation_date_id,
            speciality: e2.rotation_speciality.speciality,
            start_date: moment(e2.start_date)
              .add(1, 'days')
              .format('YYYY-MM-DD'),
            finish_date: moment(e2.finish_date)
              .add(1, 'days')
              .format('YYYY-MM-DD'),
          };
        });
        return {
          student_user_id: e.user.user_id,
          name: e.user.name,
          lastname: e.user.lastname,
          rotation_dates,
        };
      },
    );

    return students;
  }
}
