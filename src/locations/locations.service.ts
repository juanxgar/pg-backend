import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto) {
    const locationAlreadyExists = await this.prisma.location.findUnique({
      where: {
        name: createLocationDto.name,
      },
    });
    if (locationAlreadyExists) {
      throw new HttpException(
        'Ya existe una cuenta con ese correo electrónico',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { specialities, ...rest } = createLocationDto;

    try {
      const location = await this.prisma.location.create({
        data: rest,
      });

      const locationspecialities = specialities.map((e) => {
        return {
          specialitity_id: e.speciality_id,
          location_id: location.location_id,
          limit_capacity: e.limit_capacity,
        };
      });

      //corregir esta parte

      await this.prisma.location_speciality.createMany({
        data: locationspecialities,
      });
    } catch (e) {}

    return 'This action adds a new location';
  }

  findAll() {
    return `This action returns all locations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
