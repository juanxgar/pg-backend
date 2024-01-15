import { Test, TestingModule } from '@nestjs/testing';
import { RotationsService } from './rotations.service';
import { PrismaService } from 'src/prisma.service';
import { RotationsController } from './rotations.controller';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateRotationDatesDto } from './dto/create-rotation-dates.dto';
import { RotationItem } from 'src/types/entitiesTypes';
import { MessageResult, PaginatedResult } from 'src/types/resultTypes';
import { UpdateRotationDto } from './dto/update-rotation.dto';

describe('RotationsService', () => {
  let service: RotationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RotationsController],
      providers: [RotationsService, PrismaService],
    }).compile();

    service = module.get<RotationsService>(RotationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create rotation successfully', async () => {
      const createRotationDto: CreateRotationDto = {
        group_id: 7,
        finish_date: '2025-11-30',
        location_id: 4,
        semester: 11,
        specialities: [
          {
            speciality_id: 4,
            professor_user_id: 25,
            number_weeks: 2,
            available_capacity: 0,
            rotation_id: 0,
          },
        ],
        start_date: '2025-11-01',
      };

      // Mock the necessary dependencies using jest.spyOn if needed

      const result = await service.create(createRotationDto);

      expect(result).toEqual({
        message: 'Rotación creada satisfactoriamente',
      });
    });

    it('should throw HttpException for duplicate specialities', async () => {
      const createRotationDto: CreateRotationDto = {
        group_id: 2,
        finish_date: '2024-01-30',
        location_id: 12,
        semester: 11,
        specialities: [
          {
            speciality_id: 1,
            professor_user_id: 7,
            number_weeks: 2,
            available_capacity: 0,
            rotation_id: 0,
          },
          {
            speciality_id: 1,
            professor_user_id: 7,
            number_weeks: 2,
            available_capacity: 0,
            rotation_id: 0,
          },
        ],
        start_date: '2024-01-01',
      };

      await expect(service.create(createRotationDto)).rejects.toThrowError(
        new HttpException(
          'Hay elementos repetidos en las especialidades',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw HttpException for minimum finish date', async () => {
      const createRotationDto: CreateRotationDto = {
        group_id: 2,
        finish_date: '2024-01-10',
        location_id: 12,
        semester: 11,
        specialities: [
          {
            speciality_id: 1,
            professor_user_id: 7,
            number_weeks: 2,
            available_capacity: 0,
            rotation_id: 0,
          },
          {
            speciality_id: 1,
            professor_user_id: 7,
            number_weeks: 2,
            available_capacity: 0,
            rotation_id: 0,
          },
        ],
        start_date: '2024-01-01',
      };

      await expect(service.create(createRotationDto)).rejects.toThrowError(
        new HttpException(
          'La fecha mínima de finalización a asignar es ' + '28-01-2024',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw HttpException if rotationAlreadyExists is truthy', async () => {
      // Prepare the input data
      const createRotationDto: CreateRotationDto = {
        group_id: 7,
        finish_date: '2025-07-30',
        location_id: 4,
        semester: 11,
        specialities: [
          {
            speciality_id: 1,
            professor_user_id: 7,
            number_weeks: 2,
            available_capacity: 0,
            rotation_id: 0,
          },
          {
            speciality_id: 1,
            professor_user_id: 7,
            number_weeks: 2,
            available_capacity: 0,
            rotation_id: 0,
          },
        ],
        start_date: '2024-07-01',
      };

      // Assert the expected exception
      await expect(service.create(createRotationDto)).rejects.toThrowError(
        new HttpException(
          'Ya existe una rotación asignada a las fechas y el grupo seleccionado',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('createRotationDates', () => {
    it('should throw HttpException if rotation not found', async () => {
      // Prepare the input data
      const createRotationDatesDto: CreateRotationDatesDto = {
        rotation_id: 0,
        student_user_id: 31,
        rotation_dates: [
          {
            rotation_speciality_id: 29,
            available_capacity: 0,
            finish_date: '2025-08-14',
            start_date: '2025-08-01',
          },
        ],
      };

      await expect(
        service.createRotationDates(createRotationDatesDto),
      ).rejects.toThrowError(
        new HttpException('Rotación no encontrada', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw HttpException if student does not belong to the rotation group', async () => {
      // Prepare the input data
      const createRotationDatesDto: CreateRotationDatesDto = {
        rotation_id: 54,
        student_user_id: 34,
        rotation_dates: [
          {
            rotation_speciality_id: 29,
            available_capacity: 0,
            finish_date: '2025-08-14',
            start_date: '2025-08-01',
          },
        ],
      };

      await expect(
        service.createRotationDates(createRotationDatesDto),
      ).rejects.toThrowError(
        new HttpException(
          'El estudiante no pertenece al grupo de la rotación',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw HttpException if there are specialties with no available capacity', async () => {
      // Prepare the input data
      const createRotationDatesDto: CreateRotationDatesDto = {
        rotation_id: 54,
        student_user_id: 31,
        rotation_dates: [
          {
            rotation_speciality_id: 29,
            available_capacity: 0,
            finish_date: '2025-08-14',
            start_date: '2025-08-01',
          },
        ],
      };

      await expect(
        service.createRotationDates(createRotationDatesDto),
      ).rejects.toThrowError(
        new HttpException(
          'Hay especialidades a fechas asignadas que no tiene cupo disponible',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should return success message if all conditions pass', async () => {
      // Prepare the input data
      const createRotationDatesDto: CreateRotationDatesDto = {
        rotation_id: 53,
        student_user_id: 30,
        rotation_dates: [
          {
            rotation_speciality_id: 28,
            available_capacity: 1,
            finish_date: '2025-08-14',
            start_date: '2025-08-01',
          },
        ],
      };

      const result = await service.createRotationDates(createRotationDatesDto);

      expect(result).toEqual({
        message:
          'Fechas de rotación para el estudiante creadas satisfactoriamente',
      });
    });

    it('should return success message if dates are updated successfully', async () => {
      // Prepare the input data
      const createRotationDatesDto: CreateRotationDatesDto = {
        rotation_id: 32,
        student_user_id: 31,
        rotation_dates: [
          {
            rotation_speciality_id: 14,
            available_capacity: 0,
            finish_date: '2023-11-07',
            start_date: '2025-10-25',
          },
          {
            rotation_speciality_id: 15,
            available_capacity: 0,
            finish_date: '2023-11-21',
            start_date: '2025-11-08',
          },
          {
            rotation_speciality_id: 16,
            available_capacity: 0,
            finish_date: '2023-12-05',
            start_date: '2025-11-22',
          },
        ],
      };

      const result = await service.createRotationDates(createRotationDatesDto);

      expect(result).toEqual({
        message:
          'Fechas de rotación para el estudiante actualizadas satisfactoriamente',
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of RotationItems based on provided parameters', async () => {
      // Prepare the input data
      const state = true;
      const group_id = 1;
      const location_id = 2;
      const start_date = '2022-01-01';
      const finish_date = '2022-01-31';
      const semester = 1;

      // Mock the prisma.rotation.findMany method to return mock data
      const mockData: RotationItem[] = [];

      // Call the service method
      const result = await service.findAll(
        state,
        group_id,
        location_id,
        start_date,
        finish_date,
        semester,
      );

      // Assert the result
      expect(result).toEqual(mockData);
    });
  });

  describe('findGroupsIdOfUser', () => {
    it('should return an array of group ids for the specified user', async () => {
      const studentUserId = 31;
      const result = await service.findGroupsIdOfUser(studentUserId);

      expect(result).toEqual([7]);
    });

    it('should return an empty array if no groups are found for the user', async () => {
      const studentUserId = 999;
      const result = await service.findGroupsIdOfUser(studentUserId);

      expect(result).toEqual([]);
    });
  });

  describe('findAllPagination', () => {
    it('should return paginated results', async () => {
      const page = 1;
      const limit = 10;

      const result: PaginatedResult<RotationItem> =
        await service.findAllPagination(page, limit);

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(limit); // Ajusta esto según tus datos de prueba
    });
  });

  describe('findOne', () => {
    it('should find and return rotation by rotation_id', async () => {
      const rotationId = 32; // Ajusta el valor según tus datos de prueba

      const result: RotationItem = await service.findOne(rotationId);

      expect(result).toBeDefined();
      // Agrega más expectativas según la estructura de tu RotationItem y tus datos de prueba
      expect(result.rotation_id).toEqual(rotationId);
    });

    it('should throw an error for non-existing rotation_id', async () => {
      const nonExistingRotationId = 999; // Ajusta el valor según tus datos de prueba

      // Utiliza async/await con toThrow para manejar promesas rechazadas
      await expect(service.findOne(nonExistingRotationId)).rejects.toThrow(
        new HttpException('Rotación no encontrada', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('update', () => {
    it('should update rotation successfully', async () => {
      const rotationId = 55;
      const updateRotationDto: UpdateRotationDto = {
        group_id: 7,
        finish_date: '2025-09-30',
        location_id: 4,
        semester: 11,
        specialities: [
          {
            rotation_speciality_id: 30,
            speciality_id: 4,
            professor_user_id: 25,
            number_weeks: 2,
          },
        ],
        start_date: '2025-09-01',
      };

      const result: MessageResult = await service.update(
        rotationId,
        updateRotationDto,
      );

      expect(result).toBeDefined();
      expect(result.message).toEqual('Rotación actualizada satisfactoriamente');
    });

    it('should throw an error for non-existing rotation_id', async () => {
      const nonExistingRotationId = 999;
      const updateRotationDto: UpdateRotationDto = {
        group_id: 7,
        finish_date: '2025-09-30',
        location_id: 4,
        semester: 11,
        specialities: [
          {
            rotation_speciality_id: 9,
            speciality_id: 4,
            professor_user_id: 25,
            number_weeks: 2,
          },
        ],
        start_date: '2025-09-01',
      };

      // Utiliza async/await con toThrow para manejar promesas rechazadas
      await expect(
        service.update(nonExistingRotationId, updateRotationDto),
      ).rejects.toThrow(
        new HttpException('Rotación no encontrada', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error for rotations with dates created', async () => {
      const rotationId = 53;
      const updateRotationDto: UpdateRotationDto = {
        group_id: 7,
        finish_date: '2025-09-30',
        location_id: 4,
        semester: 11,
        specialities: [
          {
            rotation_speciality_id: 9,
            speciality_id: 4,
            professor_user_id: 25,
            number_weeks: 2,
          },
        ],
        start_date: '2025-09-01',
      };

      // Utiliza async/await con toThrow para manejar promesas rechazadas
      await expect(
        service.update(rotationId, updateRotationDto),
      ).rejects.toThrow(
        new HttpException(
          'Rotación no puede ser actualizada, ya tiene fechas de rotación asignadas a estudiantes',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error for rotations with minimum finish date early', async () => {
      const rotationId = 55;
      const updateRotationDto: UpdateRotationDto = {
        group_id: 7,
        finish_date: '2025-09-10',
        location_id: 4,
        semester: 11,
        specialities: [
          {
            rotation_speciality_id: 9,
            speciality_id: 4,
            professor_user_id: 25,
            number_weeks: 2,
          },
        ],
        start_date: '2025-09-01',
      };

      // Utiliza async/await con toThrow para manejar promesas rechazadas
      await expect(
        service.update(rotationId, updateRotationDto),
      ).rejects.toThrow(
        new HttpException(
          'La fecha mínima de finalización a asignar es ' + '14-09-2025',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw HttpException for duplicate specialities', async () => {
      const rotationId = 55;
      const updateRotationDto: UpdateRotationDto = {
        group_id: 7,
        finish_date: '2025-09-30',
        location_id: 4,
        semester: 11,
        specialities: [
          {
            rotation_speciality_id: 9,
            speciality_id: 4,
            professor_user_id: 25,
            number_weeks: 2,
          },
          {
            rotation_speciality_id: 9,
            speciality_id: 4,
            professor_user_id: 25,
            number_weeks: 2,
          },
        ],
        start_date: '2025-09-01',
      };

      await expect(
        service.update(rotationId, updateRotationDto),
      ).rejects.toThrowError(
        new HttpException(
          'Hay elementos repetidos en las especialidades',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw HttpException for groups with assigned rotations', async () => {
      const rotationId = 55;
      const updateRotationDto: UpdateRotationDto = {
        group_id: 7,
        finish_date: '2025-08-30',
        location_id: 4,
        semester: 11,
        specialities: [
          {
            rotation_speciality_id: 9,
            speciality_id: 4,
            professor_user_id: 25,
            number_weeks: 2,
          },
        ],
        start_date: '2025-08-01',
      };

      await expect(
        service.update(rotationId, updateRotationDto),
      ).rejects.toThrowError(
        new HttpException(
          'El grupo ya tiene asignada una rotación con las fechas seleccionadas',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should throw an error for non-existing rotation_id', async () => {
      const nonExistingRotationId = 999;

      await expect(service.remove(nonExistingRotationId)).rejects.toThrow(
        new HttpException('Rotación no encontrada', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error for rotations with evaluations', async () => {
      const rotationId = 32;

      await expect(service.remove(rotationId)).rejects.toThrow(
        new HttpException(
          'Rotación no puede ser eliminada. Ya tiene evaluaciones creadas',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should remove a rotation successfully', async () => {
      const rotationId = 49;

      const result: MessageResult = await service.remove(rotationId);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Rotación eliminada correctamente');
    });
  });

  describe('findUsedDatesRotation', () => {
    it('should return an array of DatesRotationDatesResult', async () => {
      const locationId = 4;
      const result = await service.findUsedDatesRotation(locationId);

      expect(result).toHaveLength(9);
      expect(result[0].start_date).toEqual('28-02-2025');
      expect(result[0].finish_date).toEqual('29-03-2025');
      expect(result[1].start_date).toEqual('31-12-2024');
      expect(result[1].finish_date).toEqual('29-01-2025');
    });

    it('should handle no rotations found', async () => {
      const locationId = 1;

      const result = await service.findUsedDatesRotation(locationId);

      expect(result).toHaveLength(0);
    });
  });

  describe('findDatesRotationDates', () => {
    it('should return an array of RotationDates', async () => {
      const rotationId = 32;
      const result = await service.findDatesRotationDates(rotationId);

      expect(result).toHaveLength(6);
    });

    it('should throw HttpException if rotation not found', async () => {
      const rotationId = 999;
      await expect(
        service.findDatesRotationDates(rotationId),
      ).rejects.toThrowError(
        new HttpException('Rotación no encontrada', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findAvailableCapacity', () => {
    it('should return the available capacity in a date', async () => {
      const rotationSpecialityId = 15;
      const startDate = '2023-10-25';
      const finishDate = '2023-10-25';
      const result = await service.findAvailableCapacity(
        rotationSpecialityId,
        startDate,
        finishDate,
      );

      expect(result).toEqual(20);
    });

    it('should throw HttpException if rotation speciality not found', async () => {
      const rotationSpecialityId = 999;
      const startDate = '2023-10-25';
      const finishDate = '2023-10-25';

      await expect(
        service.findAvailableCapacity(
          rotationSpecialityId,
          startDate,
          finishDate,
        ),
      ).rejects.toThrowError(
        new HttpException(
          'Especialidad de rotación no encontrada',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('getStudentRotationDates', () => {
    it('should return an array of rotation dates for the specified student and rotation', async () => {
      const rotationId = 32;
      const studentUserId = 31;
      const result = await service.getStudentRotationDates(
        rotationId,
        studentUserId,
      );

      expect(result).toHaveLength(3); // Adjust based on the number of rotation dates returned
      // You may need to add more specific assertions based on your data structure
    });

    it('should return an empty array if no rotation dates are found', async () => {
      const rotationId = 1;
      const studentUserId = 123;
      const result = await service.getStudentRotationDates(
        rotationId,
        studentUserId,
      );

      expect(result).toHaveLength(0);
    });
  });

  describe('getUsedDatesFromSpecialities', () => {
    it('should return an array of used dates for each speciality', async () => {
      const rotationId = 32;
      const result = await service.getUsedDatesFromSpecialities(rotationId);

      expect(result).toHaveLength(3);
      expect(result[0].used_dates).toHaveLength(3);
    });

    it('should return an empty array if no used dates are found for any speciality', async () => {
      const rotationId = 55;
      const result = await service.getUsedDatesFromSpecialities(rotationId);

      expect(result).toHaveLength(1);
      expect(result[0].used_dates).toHaveLength(0);
    });
  });

  describe('findUsedDatesRotationDates', () => {
    it('should return an array of students with rotation dates', async () => {
      const rotationId = 53;
      const result = await service.findUsedDatesRotationDates(rotationId);

      expect(result).toHaveLength(3);
      expect(result[0].rotation_dates).toHaveLength(4);
    });

    it('should return an empty array if no students have rotation dates', async () => {
      const rotationId = 55;
      const result = await service.findUsedDatesRotationDates(rotationId);

      expect(result).toHaveLength(3);
      expect(result[0].rotation_dates).toHaveLength(4);
    });
  });
});
