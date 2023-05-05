import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'src/prisma.service';
import { FindLocationsDto } from './dto/find-locations.dto';
import { CreateLocationSpecialityDto } from './dto/create-location-speciality.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) { }

  async create(createLocationDto: CreateLocationDto) {
    const locationAlreadyExists = await this.prisma.location.findUnique({
      where: {
        name: createLocationDto.name,
      },
    });
    if (locationAlreadyExists) {
      throw new HttpException(
        'Ya existe un centro médico con ese nombre',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { specialities, ...rest } = createLocationDto;

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

    const location = await this.prisma.location.create({
      data: rest,
    });

    specialities.map((e) => {
      e.location_id = location.location_id;
    });

    await this.prisma.location_speciality.createMany({
      data: specialities,
    });

    return {
      message: 'Centro médico creado satisfactoriamente',
    };
  }

  async findAll(findLocationDto: FindLocationsDto) {
    return await this.prisma.location.findMany({
      select: {
        location_id: true,
        adress: true,
        city: true,
        complexity: true,
        name: true,
        state: true,
        total_capacity: true,
        location_speciality: true,
      },
      where: {
        name: {
          contains: findLocationDto.name,
          mode: 'insensitive',
        },
        adress: {
          contains: findLocationDto.adress,
          mode: 'insensitive',
        },
        city: {
          contains: findLocationDto.city,
          mode: 'insensitive',
        },
        complexity: {
          contains: findLocationDto.complexity,
          mode: 'insensitive',
        },
        total_capacity: findLocationDto.total_capacity,
        state: findLocationDto.state,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAllPagination(
    findLocationDto: FindLocationsDto,
    page: number,
    quantity: number,
  ) {
    return await this.prisma.location.findMany({
      select: {
        location_id: true,
        adress: true,
        city: true,
        complexity: true,
        name: true,
        state: true,
        total_capacity: true,
        location_speciality: true,
      },
      where: {
        name: {
          contains: findLocationDto.name,
          mode: 'insensitive',
        },
        adress: {
          contains: findLocationDto.adress,
          mode: 'insensitive',
        },
        city: {
          contains: findLocationDto.city,
          mode: 'insensitive',
        },
        complexity: {
          contains: findLocationDto.complexity,
          mode: 'insensitive',
        },
        total_capacity: findLocationDto.total_capacity,
        state: findLocationDto.state,
      },
      orderBy: {
        name: 'asc',
      },
      skip: page * quantity,
      take: quantity,
    });
  }

  async findOne(location_id: number) {
    const location = await this.prisma.location.findUnique({
      select: {
        location_id: true,
        adress: true,
        city: true,
        complexity: true,
        name: true,
        state: true,
        total_capacity: true,
        location_speciality: true,
      },
      where: {
        location_id,
      },
    });
    if (!location) {
      throw new HttpException(
        'Centro médico no encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }
    return location;
  }

  async update(location_id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.prisma.location.findUnique({
      where: {
        location_id,
      },
    });
    if (!location) {
      throw new HttpException(
        'Centro médico no encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const specialitiesLocation = await this.prisma.location_speciality.findMany({
      where: {
        location_id: location.location_id,
      },
    });

    const specialitiesId = specialitiesLocation.map((e) => {
      return e.speciality_id;
    });

    const { specialities, ...rest } = updateLocationDto;

    const hasDuplicates = (array: any) => new Set(array).size < array.length;

    const specialitiesIdDto = specialities.map((e) => {
      return e.speciality_id;
    });

    if (hasDuplicates(specialitiesIdDto)) {
      throw new HttpException(
        'Hay elementos repetidos en las especialidades',
        HttpStatus.BAD_REQUEST,
      );
    }

    //Specialities to create
    const specialitiesToCreateFilter = specialities.filter((e) => !specialitiesId.includes(e.speciality_id));
    const specialitiesToCreate = specialitiesToCreateFilter.map((e) => {
      const spec = new CreateLocationSpecialityDto();
      spec.limit_capacity = e.limit_capacity;
      spec.location_id = location.location_id;
      spec.speciality_id = e.speciality_id;
      return spec;
    })
    const specialitiesIdsToCreate = specialitiesToCreate.map((e) => {
      return e.speciality_id
    });

    //Specialities ids to delete
    const specialitiesIdsToDelete = specialitiesId.filter((e) => !specialitiesIdDto.includes(e));

    //Specialities to update
    const specialitiesToUpdate = specialities.filter((e) =>
      !specialitiesIdsToCreate.includes(e.speciality_id) &&
      !specialitiesIdsToDelete.includes(e.speciality_id)
    );

    specialitiesToUpdate.forEach(async (e) => {
      await this.prisma.location_speciality.update({
        where: {
          location_speciality_id: e.location_speciality_id,
        },
        data: {
          limit_capacity: e.limit_capacity,
        }
      })
    })

    if (specialitiesIdsToDelete.length > 0) {
      await this.prisma.location_speciality.deleteMany({
        where: {
          location_id: location.location_id,
          speciality_id: {
            in: specialitiesIdsToDelete
          },
        },
      });
    }

    if (specialitiesToCreate.length > 0) {
      await this.prisma.location_speciality.createMany({
        data: specialitiesToCreate,
      });
    }

    if (updateLocationDto.name) {
      const locationByName = await this.prisma.location.findUnique({
        where: {
          name: updateLocationDto.name,
        },
      });
      if (
        locationByName &&
        locationByName.name != location.name
      ) {
        throw new HttpException(
          'Centro médico existente con nombre ingresado',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    await this.prisma.location.update({
      where: {
        location_id,
      },
      data: rest,
    });

    return {
      message: 'Centro médico actualizado satisfactoriamente',
    };
  }

  async remove(location_id: number) {
    const location = await this.prisma.location.findUnique({
      select: {
        location_id: true,
        location_speciality: true,
      },
      where: {
        location_id,
      },
    });
    if (!location) {
      throw new HttpException(
        'Centro médico no encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const locationSpecilitiesIds = location.location_speciality.map((e) => {
      return e.location_speciality_id;
    });

    await this.prisma.location_speciality.deleteMany({
      where: {
        location_speciality_id: {
          in: locationSpecilitiesIds,
        },
      },
    });

    await this.prisma.location.delete({
      where: {
        location_id: location.location_id,
      },
    });
    return {
      message: `Centro médico eliminado correctamente`,
    };
  }

  async changeState(location_id: number) {
    let location = await this.prisma.location.findUnique({
      where: {
        location_id,
      },
    });
    if (!location) {
      throw new HttpException(
        'Especialidad no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }

    location = await this.prisma.location.update({
      where: {
        location_id,
      },
      data: {
        state: !location.state,
      },
    });

    return {
      message:
        'Centro médico ' +
        (location.state ? 'habilitado' : 'inhabilitado') +
        ' satisfactoriamente',
    };
  }
}
