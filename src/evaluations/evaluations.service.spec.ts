import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { PrismaService } from 'src/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

describe('EvaluationsService', () => {
  let service: EvaluationsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationsController],
      providers: [EvaluationsService, PrismaService],
    }).compile();

    service = module.get<EvaluationsService>(EvaluationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findRotationIdByStudentAndSpeciality', () => {
    it('should return rotation_date_id when found', async () => {
      // Configura tus datos de prueba
      const studentUserId = 31;
      const rotationSpecialityId = 14;
      const rotationDateId = 1;

      // Ejecuta la función y verifica el resultado
      const result = await service.findRotationIdByStudentAndSpeciality(
        studentUserId,
        rotationSpecialityId,
      );
      expect(result).toBe(rotationDateId);
    });

    it('should throw HttpException when rotation_date_id not found', async () => {
      // Configura tus datos de prueba
      const studentUserId = 1;
      const rotationSpecialityId = 2;

      // Ejecuta la función y verifica que arroje la excepción correcta
      await expect(
        service.findRotationIdByStudentAndSpeciality(
          studentUserId,
          rotationSpecialityId,
        ),
      ).rejects.toThrowError(
        new HttpException(
          'Fecha de rotación de estudiante no encontrada',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('create', () => {
    it('should create evaluation successfully', async () => {
      // Configura tus datos de prueba
      const createEvaluationDto: CreateEvaluationDto = {
        rotation_speciality_id: 16,
        student_user_id: 31,
        professor_comments: 'Comentario de prueba',
        student_grades: [
          { evaluation_id: 0, subdescription_exam_id: 1, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 2, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 3, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 4, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 5, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 6, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 7, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 8, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 9, grade_value: 1 },
        ],
      };

      // Ejecuta la función y verifica el resultado
      const result = await service.create(createEvaluationDto);
      expect(result).toEqual({
        message: 'Evaluación creada correctamente',
      });
    });

    it('should throw HttpException when rotation_date_id not found', async () => {
      // Configura tus datos de prueba
      const createEvaluationDto: CreateEvaluationDto = {
        rotation_speciality_id: 1,
        student_user_id: 2,
        professor_comments: 'Comentario de prueba',
        student_grades: [
          { evaluation_id: 0, subdescription_exam_id: 1, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 2, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 3, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 4, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 5, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 6, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 7, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 8, grade_value: 1 },
          { evaluation_id: 0, subdescription_exam_id: 9, grade_value: 1 },
        ],
      };

      // Ejecuta la función y verifica que arroje la excepción correcta
      await expect(service.create(createEvaluationDto)).rejects.toThrowError(
        new HttpException(
          'Fecha de rotación de estudiante no encontrada',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('findBySpecialityAndDate', () => {
    it('should find evaluation by speciality and date', async () => {
      // Configura tus datos de prueba
      const rotation_speciality_id = 14;
      const rotation_date_id = 1;

      // Configura el comportamiento del Prisma para devolver datos de prueba
      jest.spyOn(prismaService.evalution, 'findFirst').mockResolvedValue({
        evaluation_id: 1,
        rotation_speciality_id: 14,
        rotation_date_id: 1,
        grade_value: 5,
        professor_comments: 'estoy en pruebas',
        student_comments: '',
      });

      // Ejecuta la función y verifica el resultado
      const result = await service.findBySpecialityAndDate(
        rotation_speciality_id,
        rotation_date_id,
      );
      expect(result).toEqual({
        evaluation_id: 1,
        rotation_speciality_id: 14,
        rotation_date_id: 1,
        grade_value: 5,
        professor_comments: 'estoy en pruebas',
        student_comments: '',
      });
    });

    it('should throw HttpException when evaluation not found', async () => {
      const rotation_speciality_id = 1;
      const rotation_date_id = 1;

      // Ejecuta la función y verifica que arroje la excepción correcta
      await expect(
        service.findBySpecialityAndDate(
          rotation_speciality_id,
          rotation_date_id,
        ),
      ).rejects.toThrowError(
        new HttpException('Evaluación no encontrada', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findBySpecialityAndStudent', () => {
    it('should find evaluation by speciality and student', async () => {
      // Configura tus datos de prueba
      const rotation_speciality_id = 14;
      const student_user_id = 31;

      // Configura el comportamiento del Prisma para devolver datos de prueba
      jest.spyOn(prismaService.evalution, 'findFirst').mockResolvedValue({
        evaluation_id: 1,
        rotation_speciality_id: 14,
        rotation_date_id: 1,
        grade_value: 5,
        professor_comments: 'estoy en pruebas',
        student_comments: '',
      });

      // Ejecuta la función y verifica el resultado
      const result = await service.findBySpecialityAndStudent(
        rotation_speciality_id,
        student_user_id,
      );
      expect(result).toEqual({
        evaluation_id: 1,
        rotation_speciality_id: 14,
        rotation_date_id: 1,
        grade_value: 5,
        professor_comments: 'estoy en pruebas',
        student_comments: '',
      });
    });

    it('should throw HttpException when evaluation not found', async () => {
      // Configura tus datos de prueba
      const rotation_speciality_id = 1;
      const student_user_id = 1;

      // Configura el comportamiento del Prisma para no encontrar datos
      jest.spyOn(prismaService.evalution, 'findFirst').mockResolvedValue(null);

      // Ejecuta la función y verifica que arroje la excepción correcta
      await expect(
        service.findBySpecialityAndStudent(
          rotation_speciality_id,
          student_user_id,
        ),
      ).rejects.toThrowError(
        new HttpException('Evaluación no encontrada', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('update', () => {
    it('should update evaluation and student grades', async () => {
      // Configura tus datos de prueba
      const evaluation_id = 1;
      const updateEvaluationDto: UpdateEvaluationDto = {
        professor_comments: 'Comentario de prueba',
        student_comments: 'Comentario de prueba 2',
        student_grades: [
          {
            student_grade_id: 1,
            grade_value: 4.8,
          },
          {
            student_grade_id: 2,
            grade_value: 4.6,
          },
        ],
      };

      // Configura el comportamiento del Prisma para devolver datos de prueba
      jest.spyOn(prismaService.evalution, 'findUnique').mockResolvedValue({
        evaluation_id: 1,
        rotation_speciality_id: 14,
        rotation_date_id: 1,
        grade_value: 5,
        professor_comments: 'estoy en pruebas',
        student_comments: '',
      });

      jest.spyOn(prismaService.evalution, 'update').mockResolvedValue({
        evaluation_id: 1,
        rotation_speciality_id: 14,
        rotation_date_id: 1,
        grade_value: 5,
        professor_comments: 'estoy en pruebas',
        student_comments: '',
      });

      jest.spyOn(prismaService.student_grade, 'update').mockResolvedValue({
        student_grade_id: 1,
        evaluation_id: 1,
        subdescription_exam_id: 1,
        grade_value: 1,
      });

      // Ejecuta la función y verifica el resultado
      const result = await service.update(evaluation_id, updateEvaluationDto);
      expect(result).toEqual({
        message: 'Evaluación actualizada correctamente',
      });
    });

    it('should throw HttpException when evaluation not found', async () => {
      // Configura tus datos de prueba
      const evaluation_id = 1;
      const updateEvaluationDto = {
        professor_comments: 'Comentario de prueba',
        student_comments: 'Comentario de prueba 2',
        student_grades: [
          {
            student_grade_id: 1,
            grade_value: 4.8,
          },
          {
            student_grade_id: 2,
            grade_value: 4.6,
          },
        ],
      };

      // Configura el comportamiento del Prisma para no encontrar datos
      jest.spyOn(prismaService.evalution, 'findUnique').mockResolvedValue(null);

      // Ejecuta la función y verifica que arroje la excepción correcta
      await expect(
        service.update(evaluation_id, updateEvaluationDto),
      ).rejects.toThrowError(
        new HttpException('Evaluación no encontrada', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
