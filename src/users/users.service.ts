import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { MessageResult, PaginatedResult } from 'src/types/resultTypes';
import { UserItem } from 'src/types/entitiesTypes';
import { PaginateFunction } from 'src/types/types';
import { paginator } from 'src/util/Paginator';
import { JWTUtil } from 'src/util/JWTUtil';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  async create(createUser: CreateUserDto): Promise<MessageResult> {
    let userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email: createUser.email,
      },
    });
    if (userAlreadyExists) {
      throw new HttpException(
        'Ya existe una cuenta con ese correo electrónico',
        HttpStatus.BAD_REQUEST,
      );
    }

    userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        identification: createUser.identification,
      },
    });
    if (userAlreadyExists) {
      throw new HttpException(
        'Ya existe una cuenta con el número de identificación',
        HttpStatus.BAD_REQUEST,
      );
    }

    userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        code: createUser.code,
      },
    });
    if (userAlreadyExists) {
      throw new HttpException(
        'Ya existe una cuenta con el número de código',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { speciality_id, ...rest } = createUser;

    try {
      const hashPassword = await bcrypt.hash(createUser.password, 10);
      const user = await this.prisma.user.create({
        data: { ...rest, password: hashPassword },
      });

      if (createUser.role == 'Profesor') {
        await this.prisma.professor_speciality.create({
          data: {
            user_id: user.user_id,
            speciality_id: speciality_id,
          },
        });
      }
    } catch (e) {
      throw new HttpException(
        'Error creando usuario. Verifica los datos',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Usuario creado satisfactoriamente',
    };
  }

  async findLoggedUser(auth: string) {
    const decodedToken = this.jwtUtil.decode(auth);

    const user = await this.prisma.user.findUnique({
      where: {
        user_id: decodedToken.user_id,
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async findAllStudents(
    state: boolean,
    name?: string,
    identification?: number,
    code?: string,
    email?: string,
  ): Promise<Array<UserItem>> {
    return await this.prisma.user.findMany({
      select: {
        user_id: true,
        name: true,
        lastname: true,
        identification: true,
        role: true,
        code: true,
        email: true,
        state: true,
      },
      where: name
        ? {
            OR: [
              {
                name: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
              {
                lastname: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
            ],
            code: {
              contains: code,
              mode: 'insensitive',
            },
            email: {
              contains: email,
              mode: 'insensitive',
            },
            role: 'Estudiante',
            identification: identification || undefined,
            state,
          }
        : {
            code: {
              contains: code,
              mode: 'insensitive',
            },
            email: {
              contains: email,
              mode: 'insensitive',
            },
            role: 'Estudiante',
            identification: identification || undefined,
            state,
          },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAllStudentsPagination(
    page: number,
    limit: number,
    name?: string,
    identification?: number,
    code?: string,
    email?: string,
    state?: boolean,
  ): Promise<PaginatedResult<UserItem>> {
    const paginate: PaginateFunction = paginator({});
    return paginate(
      this.prisma.user,
      {
        page,
        perPage: limit,
      },
      {
        where: name
          ? {
              OR: [
                {
                  name: {
                    contains: name,
                    mode: 'insensitive',
                  },
                },
                {
                  lastname: {
                    contains: name,
                    mode: 'insensitive',
                  },
                },
              ],
              code: {
                contains: code,
                mode: 'insensitive',
              },
              email: {
                contains: email,
                mode: 'insensitive',
              },
              role: 'Estudiante',
              identification: identification || undefined,
              state,
            }
          : {
              code: {
                contains: code,
                mode: 'insensitive',
              },
              email: {
                contains: email,
                mode: 'insensitive',
              },
              role: 'Estudiante',
              identification: identification || undefined,
              state,
            },
        orderBy: {
          name: 'asc',
        },
      },
    );
  }

  async findAllProfessors(
    name?: string,
    identification?: number,
    code?: string,
    email?: string,
    speciality_id?: number,
    state?: boolean,
  ): Promise<Array<UserItem>> {
    let professorsFromSpeciality: any;
    let professorsId: any;
    if (speciality_id) {
      professorsFromSpeciality =
        await this.prisma.professor_speciality.findMany({
          select: {
            user_id: true,
          },
          where: {
            speciality_id,
          },
        });
      professorsId = professorsFromSpeciality.map((e) => {
        return e.user_id;
      });
    }
    return await this.prisma.user.findMany({
      select: {
        user_id: true,
        name: true,
        lastname: true,
        identification: true,
        role: true,
        code: true,
        email: true,
        state: true,
        professor_speciality: true,
      },
      where: name
        ? {
            OR: [
              {
                name: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
              {
                lastname: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
            ],
            code: {
              contains: code,
              mode: 'insensitive',
            },
            email: {
              contains: email,
              mode: 'insensitive',
            },
            role: 'Profesor',
            identification: identification || undefined,
            user_id: {
              in: professorsId || undefined,
            },
            state,
          }
        : {
            code: {
              contains: code,
              mode: 'insensitive',
            },
            email: {
              contains: email,
              mode: 'insensitive',
            },
            role: 'Profesor',
            identification: identification || undefined,
            user_id: {
              in: professorsId || undefined,
            },
            state,
          },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAllProfessorsPagination(
    page: number,
    limit: number,
    state: boolean,
    name?: string,
    identification?: number,
    code?: string,
    email?: string,
    speciality_id?: number,
  ): Promise<PaginatedResult<UserItem>> {
    let professorsFromSpeciality: any;
    let professorsId: any;
    if (speciality_id) {
      professorsFromSpeciality =
        await this.prisma.professor_speciality.findMany({
          select: {
            user_id: true,
          },
          where: {
            speciality_id,
          },
        });
      professorsId = professorsFromSpeciality.map((e) => {
        return e.user_id;
      });
    }
    const paginate: PaginateFunction = paginator({});
    return paginate(
      this.prisma.user,
      {
        page,
        perPage: limit,
      },
      {
        select: {
          user_id: true,
          name: true,
          lastname: true,
          identification: true,
          code: true,
          email: true,
          state: true,
          professor_speciality: {
            select: {
              speciality: true,
            },
          },
        },
        where: name
          ? {
              OR: [
                {
                  name: {
                    contains: name,
                    mode: 'insensitive',
                  },
                },
                {
                  lastname: {
                    contains: name,
                    mode: 'insensitive',
                  },
                },
              ],
              code: {
                contains: code,
                mode: 'insensitive',
              },
              email: {
                contains: email,
                mode: 'insensitive',
              },
              role: 'Profesor',
              identification: identification || undefined,
              user_id: {
                in: professorsId || undefined,
              },
              state,
            }
          : {
              code: {
                contains: code,
                mode: 'insensitive',
              },
              email: {
                contains: email,
                mode: 'insensitive',
              },
              role: 'Profesor',
              identification: identification || undefined,
              user_id: {
                in: professorsId || undefined,
              },
              state,
            },
        orderBy: {
          name: 'asc',
        },
      },
    );
  }

  async findOne(user_id: number): Promise<UserItem> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<MessageResult> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.identification) {
      const userByIdentification = await this.prisma.user.findUnique({
        where: {
          identification: updateUserDto.identification,
        },
      });
      if (
        userByIdentification &&
        userByIdentification.identification != user.identification
      ) {
        throw new HttpException(
          'Usuario existente con numero de identificación ingresado',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateUserDto.code) {
      const userByCode = await this.prisma.user.findUnique({
        where: {
          code: updateUserDto.code,
        },
      });
      if (userByCode && userByCode.code != user.code) {
        throw new HttpException(
          'Usuario existente con numero de código ingresado',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateUserDto.email) {
      const userByEmail = await this.prisma.user.findUnique({
        where: {
          email: updateUserDto.email,
        },
      });
      if (userByEmail && userByEmail.email != user.email) {
        throw new HttpException(
          'Usuario existente con correo electrónico ingresado',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      updateUserDto.role &&
      updateUserDto.role === 'Profesor' &&
      updateUserDto.speciality_id
    ) {
      const professorSpeciality =
        await this.prisma.professor_speciality.findFirst({
          select: {
            professor_especiality_id: true,
          },
          where: {
            user_id,
          },
        });
      await this.prisma.professor_speciality.update({
        where: {
          professor_especiality_id:
            professorSpeciality.professor_especiality_id,
        },
        data: {
          speciality_id: updateUserDto.speciality_id,
        },
      });
    }

    let hashPassword = null;
    if (updateUserDto.password) {
      hashPassword = await bcrypt.hash(updateUserDto.password, 10);
    } else {
      hashPassword = user.password;
    }

    await this.prisma.user.update({
      where: {
        user_id,
      },
      data: {
        name: updateUserDto.name,
        lastname: updateUserDto.lastname,
        identification: updateUserDto.identification,
        role: updateUserDto.role,
        code: updateUserDto.code,
        email: updateUserDto.email,
        password: hashPassword,
      },
    });
    return {
      message: 'Usuario actualizado satisfactoriamente',
    };
  }

  async remove(user_id: number): Promise<MessageResult> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
    }
    if (user.role === 'Profesor') {
      const professor_specialities =
        await this.prisma.professor_speciality.findMany({
          where: {
            user_id: user.user_id,
          },
        });

      const professor_specialties_ids = professor_specialities.map((e) => {
        return e.professor_especiality_id;
      });

      await this.prisma.professor_speciality.deleteMany({
        where: {
          professor_especiality_id: {
            in: professor_specialties_ids,
          },
        },
      });
    }
    await this.prisma.user.delete({
      where: {
        user_id,
      },
    });
    return {
      message: `Usuario eliminado correctamente`,
    };
  }

  async changeState(user_id: number): Promise<MessageResult> {
    let user = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
    }

    user = await this.prisma.user.update({
      where: {
        user_id,
      },
      data: {
        state: !user.state,
      },
    });

    return {
      message:
        'Usuario ' +
        (user.state ? 'habilitado' : 'inhabilitado') +
        ' satisfactoriamente',
    };
  }
}
