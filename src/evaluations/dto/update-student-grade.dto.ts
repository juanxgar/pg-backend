import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentGradeDto {
  @ApiProperty()
  student_grade_id: number;

  @ApiProperty()
  grade_value: number;
}
