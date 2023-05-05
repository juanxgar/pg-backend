import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUser: CreateUserDto) {
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

    const { speciality, ...rest } = createUser;

    try {
      const hashPassword = await bcrypt.hash(createUser.password, 10);
      const user = await this.prisma.user.create({
        data: { ...rest, password: hashPassword },
      });

      if (createUser.role == 'Profesor') {
        const specialityUser = await this.prisma.speciality.findUnique({
          where: {
            description: speciality,
          },
        });
        await this.prisma.professor_especiality.create({
          data: {
            user_id: user.user_id,
            speciality_id: specialityUser.speciality_id,
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

  async findAll(role: string, name: string) {
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
      where: {
        role,
        name: {
          contains: name,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAllPagination(
    role: string,
    name: string,
    page: number,
    quantity: number,
  ) {
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
      where: {
        role,
        name: {
          contains: name,
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip: page * quantity,
      take: quantity,
    });
  }

  async findOne(user_id: number) {
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

  async update(user_id: number, updateUserDto: UpdateUserDto) {
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

  async remove(user_id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
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

  async changeState(user_id: number) {
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
