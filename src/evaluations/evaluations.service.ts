import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EvaluationsService {
  constructor(private prisma: PrismaService) {}

  async create(createEvaluationDto: CreateEvaluationDto) {
    const { student_grades, ...rest } = createEvaluationDto;

    const evaluation = await this.prisma.evalution.create({
      data: rest,
    });

    student_grades.forEach((e) => {
      e.evaluation_id = evaluation.evaluation_id;
    });

    await this.prisma.student_grade.createMany({
      data: student_grades,
    });

    return {
      message: 'Evaluación creada correctamente',
    };
  }

  //Find evaluation if its created
  async findBySpecialityAndDate(
    rotation_speciality_id: number,
    rotation_date_id: number,
  ) {
    const evaluation = await this.prisma.evalution.findFirst({
      where: {
        rotation_speciality_id,
        rotation_date_id,
      },
    });
    if (!evaluation) {
      return {
        message: 'Evaluación no creada',
      };
    }
    return evaluation;
  }

  async update(
    evaluation_id: number,
    updateEvaluationDto: UpdateEvaluationDto,
  ) {
    const evaluation = await this.prisma.evalution.findUnique({
      where: {
        evaluation_id,
      },
    });
    if (!evaluation) {
      throw new HttpException(
        'Evaluación no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { student_grades, ...rest } = updateEvaluationDto;

    await this.prisma.evalution.update({
      where: {
        evaluation_id,
      },
      data: rest,
    });

    for (const e of student_grades) {
      await this.prisma.student_grade.update({
        where: {
          student_grade_id: e.student_grade_id,
        },
        data: {
          grade_value: e.grade_value,
        },
      });
    }

    return {
      message: 'Evaluación actualizada correctamente',
    };
  }
}
