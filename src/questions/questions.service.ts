import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.description_exam.findMany({
      select: {
        description_exam_id: true,
        description: true,
        subdescription_exam: {
          select: {
            subdescription_exam_id: true,
            subdescription: true,
          },
          orderBy: {
            subdescription_exam_id: 'asc',
          },
        },
      },
      orderBy: {
        description_exam_id: 'asc',
      },
    });
  }
}
