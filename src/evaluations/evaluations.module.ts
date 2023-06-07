import { Module } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EvaluationsController],
  providers: [EvaluationsService, PrismaService],
  exports: [EvaluationsModule],
})
export class EvaluationsModule {}
