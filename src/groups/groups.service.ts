import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginateFunction } from 'src/types/types';
import { paginator } from 'src/util/Paginator';
import {
  MessageResult,
  PaginatedResult,
  StudentsFinishRotationResult,
} from 'src/types/resultTypes';
import { GroupDetailItem, GroupItem, UserItem } from 'src/types/entitiesTypes';
import { user } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto): Promise<MessageResult> {
    const groupAlreadyExists = await this.prisma.group.findUnique({
      where: {
        name: createGroupDto.name,
      },
    });
    if (groupAlreadyExists) {
      throw new HttpException(
        'Ya existe un grupo con ese nombre',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { group_detail, ...rest } = createGroupDto;

    const group = await this.prisma.group.create({
      data: rest,
    });

    group_detail.forEach((e) => {
      e.group_id = group.group_id;
    });

    await this.prisma.group_detail.createMany({
      data: group_detail,
    });

    return {
      message: 'Grupo creado satisfactoriamente',
    };
  }

  async findAll(
    state: boolean,
    name?: string,
    professor_user_id?: number,
  ): Promise<Array<GroupItem>> {
    return this.prisma.group.findMany({
      select: {
        group_id: true,
        name: true,
        state: true,
        professor_user: true,
      },
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
        professor_user_id: professor_user_id ? professor_user_id : undefined,
        state,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAllPagination(
    state: boolean,
    page: number,
    limit: number,
    name?: string,
    professor_user_id?: number,
  ): Promise<PaginatedResult<GroupItem>> {
    const paginate: PaginateFunction = paginator({});

    return paginate(
      this.prisma.group,
      {
        page,
        perPage: limit,
      },
      {
        select: {
          group_id: true,
          name: true,
          state: true,
          professor_user: true,
        },
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
          professor_user_id: professor_user_id ? professor_user_id : undefined,
          state,
        },
        orderBy: {
          name: 'asc',
        },
      },
    );
  }

  async findGroupDetailPagination(
    page: number,
    limit: number,
    group_id: number,
    name?: string,
  ): Promise<PaginatedResult<GroupDetailItem>> {
    const paginate: PaginateFunction = paginator({});

    return paginate(
      this.prisma.group_detail,
      {
        page,
        perPage: limit,
      },
      {
        select: {
          group_detail_id: true,
          user: true,
        },
        where: {
          group_id,
          user: {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
        },
        orderBy: {
          user: {
            name: 'asc',
          },
        },
      },
    );
  }

  async findOne(group_id: number): Promise<GroupItem> {
    const group = await this.prisma.group.findUnique({
      select: {
        group_id: true,
        name: true,
        state: true,
        professor_user: true,
        group_detail: {
          select: {
            group_detail_id: true,
            user: true,
          },
        },
      },
      where: {
        group_id,
      },
    });
    if (!group) {
      throw new HttpException('Grupo no encontrado', HttpStatus.BAD_REQUEST);
    }
    return group;
  }

  async update(
    group_id: number,
    updateGroupDto: UpdateGroupDto,
  ): Promise<MessageResult> {
    const hasDuplicates = (array: number[]) =>
      new Set(array).size < array.length;

    const group = await this.prisma.group.findUnique({
      select: {
        group_id: true,
        name: true,
        professor_user_id: true,
        group_detail: true,
      },
      where: {
        group_id,
      },
    });
    if (!group) {
      throw new HttpException('Grupo no encontrado', HttpStatus.BAD_REQUEST);
    }

    const { group_detail, ...rest } = group;

    const userIds = group_detail.map((e) => {
      return e.user_id;
    });

    const userIdsDto = updateGroupDto.group_detail.map((e) => {
      return e.user_id;
    });

    if (hasDuplicates(userIdsDto)) {
      throw new HttpException('Hay usuarios repetidos', HttpStatus.BAD_REQUEST);
    }

    const usersToAdd = updateGroupDto.group_detail.filter(
      (e) => !userIds.includes(e.user_id),
    );
    usersToAdd.forEach((e) => {
      e.group_id = group.group_id;
    });

    const usersToDelete = userIds.filter((e) => !userIdsDto.includes(e));

    if (usersToDelete.length > 0) {
      await this.prisma.group_detail.deleteMany({
        where: {
          group_id: group.group_id,
          user_id: {
            in: usersToDelete,
          },
        },
      });
    }

    if (usersToAdd.length > 0) {
      await this.prisma.group_detail.createMany({
        data: usersToAdd,
      });
    }

    if (rest.name) {
      const groupByName = await this.prisma.group.findUnique({
        where: {
          name: updateGroupDto.name,
        },
      });
      if (groupByName && groupByName.name != group.name) {
        throw new HttpException(
          'Grupo existente con nombre ingresado',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.prisma.group.update({
      where: {
        group_id,
      },
      data: {
        name: updateGroupDto.name,
        professor_user_id: updateGroupDto.professor_user_id,
      },
    });

    return {
      message: 'Grupo actualizado satisfactoriamente',
    };
  }

  async remove(group_id: number): Promise<MessageResult> {
    const group = await this.prisma.group.findUnique({
      select: {
        group_id: true,
        group_detail: true,
      },
      where: {
        group_id,
      },
    });
    if (!group) {
      throw new HttpException('Grupo no encontrado', HttpStatus.BAD_REQUEST);
    }

    const groupDetailIds = group.group_detail.map((e) => {
      return e.group_detail_id;
    });

    await this.prisma.group_detail.deleteMany({
      where: {
        group_id,
        group_detail_id: {
          in: groupDetailIds,
        },
      },
    });

    await this.prisma.group.delete({
      where: {
        group_id,
      },
    });

    return {
      message: `Grupo eliminado correctamente`,
    };
  }

  async changeState(group_id: number): Promise<MessageResult> {
    let group = await this.prisma.group.findUnique({
      where: {
        group_id,
      },
    });
    if (!group) {
      throw new HttpException('Grupo no encontrado', HttpStatus.BAD_REQUEST);
    }

    group = await this.prisma.group.update({
      where: {
        group_id,
      },
      data: {
        state: !group.state,
      },
    });

    return {
      message:
        'Grupo ' +
        (group.state ? 'habilitado' : 'inhabilitado') +
        ' satisfactoriamente',
    };
  }

  //Students that finished the rotation in the group
  async findStudentsFinishRotation(
    group_id: number,
    rotation_id: number,
    speciality_id?: number,
  ): Promise<StudentsFinishRotationResult> {
    const group = await this.prisma.group.findFirst({
      select: {
        group_id: true,
        name: true,
        rotation: {
          select: {
            rotation_id: true,
            rotation_date: {
              select: {
                rotation_date_id: true,
                rotation_speciality_id: true,
                student: true,
              },
              where: {
                finish_date: {
                  lte: new Date(),
                },
                rotation_speciality: {
                  speciality_id: speciality_id ? speciality_id : undefined,
                },
              },
            },
          },
          where: {
            rotation_id,
          },
        },
      },
      where: {
        group_id,
      },
    });
    if (!group) {
      throw new HttpException('Grupo no encontrado', HttpStatus.BAD_REQUEST);
    }

    return {
      group_id: group.group_id,
      name: group.name,
      students: group.rotation[0].rotation_date.map((e) => {
        return {
          rotation_speciality_id: e.rotation_speciality_id,
          rotation_date_id: e.rotation_date_id,
          student: e.student,
        };
      }),
    };
  }
}
