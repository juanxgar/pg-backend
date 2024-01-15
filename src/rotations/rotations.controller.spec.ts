import { Test, TestingModule } from '@nestjs/testing';
import { RotationsController } from './rotations.controller';
import { RotationsService } from './rotations.service';
import { PrismaService } from 'src/prisma.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { MessageResult } from 'src/types/resultTypes';

describe('RotationsController', () => {
  let controller: RotationsController;
  let rotationsService: RotationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RotationsController],
      providers: [RotationsService, PrismaService],
    }).compile();

    controller = module.get<RotationsController>(RotationsController);
    rotationsService = module.get<RotationsService>(RotationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call rotationsService.create with the correct parameters', async () => {
      const createRotationDto: CreateRotationDto = {
        group_id: 7,
        finish_date: '2025-10-30',
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
        start_date: '2025-10-01',
      };

      const expectedMessageResult: MessageResult = {
        message: 'Rotación creada satisfactoriamente',
      };

      // Mock the rotationsService.create method to return the expected result
      jest
        .spyOn(rotationsService, 'create')
        .mockResolvedValue(expectedMessageResult);

      // Call the controller method
      const result = await controller.create(createRotationDto);

      // Assert that rotationsService.create was called with the correct parameters
      expect(rotationsService.create).toHaveBeenCalledWith(createRotationDto);

      // Assert the result returned by the controller
      expect(result).toEqual(expectedMessageResult);
    });
  });
});
