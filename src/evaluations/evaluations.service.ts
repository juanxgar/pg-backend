import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { PrismaService } from 'src/prisma.service';
import { EvaluationCreatedResult, MessageResult } from 'src/types/resultTypes';

@Injectable()
export class EvaluationsService {
  constructor(private prisma: PrismaService) {}

  async findRotationIdByStudentAndSpeciality(
    student_user_id: number,
    rotation_speciality_id: number,
  ): Promise<number> {
    const rotationDateId = await this.prisma.rotation_date.findFirst({
      where: {
        student_user_id,
        rotation_speciality_id,
      },
    });
    if (!rotationDateId) {
      throw new HttpException(
        'Fecha de rotación de estudiante no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    return rotationDateId.rotation_date_id;
  }

  async create(
    createEvaluationDto: CreateEvaluationDto,
  ): Promise<MessageResult> {
    const { student_grades, student_user_id, ...rest } = createEvaluationDto;

    const rotationDateId = await this.findRotationIdByStudentAndSpeciality(
      student_user_id,
      rest.rotation_speciality_id,
    );
    const data = { rotation_date_id: rotationDateId, ...rest };
    const evaluation = await this.prisma.evalution.create({
      data,
    });

    student_grades.forEach((e) => {
      e.evaluation_id = evaluation.evaluation_id;
    });

    await this.prisma.student_grade.createMany({
      data: student_grades,
    });

    let sum = 0;
    student_grades.forEach((e) => {
      sum = sum + e.grade_value;
    });

    const prom = sum / student_grades.length;

    await this.prisma.evalution.update({
      where: {
        evaluation_id: evaluation.evaluation_id,
      },
      data: {
        grade_value: prom,
      },
    });

    return {
      message: 'Evaluación creada correctamente',
    };
  }

  //Find evaluation if its created
  async findBySpecialityAndDate(
    rotation_speciality_id: number,
    rotation_date_id: number,
  ): Promise<EvaluationCreatedResult | MessageResult> {
    const evaluation = await this.prisma.evalution.findFirst({
      where: {
        rotation_speciality_id,
        rotation_date_id,
      },
    });
    if (!evaluation) {
      throw new HttpException(
        'Evaluación no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    return evaluation;
  }

  async findBySpecialityAndStudent(
    rotation_speciality_id: number,
    student_user_id: number,
  ): Promise<EvaluationCreatedResult | MessageResult> {
    const evaluation = await this.prisma.evalution.findFirst({
      select: {
        evaluation_id: true,
        rotation_speciality_id: true,
        rotation_date_id: true,
        grade_value: true,
        professor_comments: true,
        student_comments: true,
        student_grade: {
          select: {
            student_grade_id: true,
            evaluation_id: true,
            subdescription_exam_id: true,
            grade_value: true,
          },
          orderBy: {
            subdescription_exam_id: 'asc',
          },
        },
      },
      where: {
        rotation_speciality_id,
        rotation_date: {
          student_user_id,
          rotation_speciality_id,
        },
      },
    });
    if (!evaluation) {
      throw new HttpException(
        'Evaluación no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    return evaluation;
  }

  async update(
    evaluation_id: number,
    updateEvaluationDto: UpdateEvaluationDto,
  ): Promise<MessageResult> {
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

    let sum = 0;
    student_grades.forEach((e) => {
      sum = sum + e.grade_value;
    });

    const prom = sum / student_grades.length;

    await this.prisma.evalution.update({
      where: {
        evaluation_id: evaluation.evaluation_id,
      },
      data: {
        grade_value: prom,
      },
    });

    return {
      message: 'Evaluación actualizada correctamente',
    };
  }
}
