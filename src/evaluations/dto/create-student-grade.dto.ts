import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentGradeDto {
  @ApiProperty()
  evaluation_id: number;

  @ApiProperty()
  subdescription_exam_id: number;

  @ApiProperty()
  grade_value: number;
}
