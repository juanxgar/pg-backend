import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationsService } from './evaluations.service';
import { PrismaService } from 'src/prisma.service';

describe('EvaluationsController', () => {
  let controller: EvaluationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationsController],
      providers: [EvaluationsService, PrismaService],
    }).compile();

    controller = module.get<EvaluationsController>(EvaluationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
