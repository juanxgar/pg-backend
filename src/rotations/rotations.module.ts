import { Module } from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { RotationsController } from './rotations.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RotationsController],
  providers: [RotationsService, PrismaService],
  exports: [RotationsModule]
})
export class RotationsModule { }
