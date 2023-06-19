import { ApiProperty } from '@nestjs/swagger';
import { CreateStudentGradeDto } from './create-student-grade.dto';

export class CreateEvaluationDto {
  @ApiProperty()
  rotation_speciality_id: number;

  @ApiProperty()
  rotation_date_id: number;

  @ApiProperty()
  professor_comments: string;

  @ApiProperty({
    type: Array<CreateStudentGradeDto>,
    default: {
      subdescription_exam_id: 0,
      grade_value: 0.0,
    },
  })
  student_grades: Array<CreateStudentGradeDto>;
}
