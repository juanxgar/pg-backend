import { Module } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { SpecialitiesController } from './specialities.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService, PrismaService],
  exports: [SpecialitiesService],
})
export class SpecialitiesModule {}
