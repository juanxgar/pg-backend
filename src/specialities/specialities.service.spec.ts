import { Test, TestingModule } from '@nestjs/testing';
import { SpecialitiesService } from './specialities.service';
import { SpecialitiesController } from './specialities.controller';
import { PrismaService } from 'src/prisma.service';

describe('SpecialitiesService', () => {
  let service: SpecialitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialitiesController],
      providers: [SpecialitiesService, PrismaService],
    }).compile();

    service = module.get<SpecialitiesService>(SpecialitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
