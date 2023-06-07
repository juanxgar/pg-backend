import { ApiProperty } from '@nestjs/swagger';
import { UpdateStudentGradeDto } from './update-student-grade.dto';

export class UpdateEvaluationDto {
  @ApiProperty()
  professor_comments: string;

  @ApiProperty()
  student_comments: string;

  @ApiProperty()
  student_grades: Array<UpdateStudentGradeDto>;
}
