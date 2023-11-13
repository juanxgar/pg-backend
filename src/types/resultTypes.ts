import {
  RotationSpecialityItem,
  SpecialityItem,
  UserItem,
} from './entitiesTypes';

export type LoginResult = {
  token: string;
  role: string;
};

export type MessageResult = {
  message: string;
};

export type EvaluationCreatedResult = {
  evaluation_id: number;
  rotation_speciality_id: number;
  rotation_date_id: number;
  grade_value?: number;
  professor_comments?: string;
  student_comments: string;
  student_grade?: Array<StudentGrade>;
};
export type StudentGrade = {
  student_grade_id: number;
  evaluation_id: number;
  subdescription_exam_id: number;
  grade_value: number;
};

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
};

export type StudentFinishesRotation = {
  rotation_speciality_id: number;
  rotation_date_id: number;
  student: UserItem;
};

export type StudentsFinishRotationResult = {
  group_id: number;
  name: string;
  students: Array<StudentFinishesRotation>;
};

export type DatesRotationDatesResult = {
  start_date: string;
  finish_date: string;
};

export type RotationsOfGroupResult = {
  rotation_id: number;
  start_date: Date;
  finish_date: Date;
};

export type UsedRotationDatesBySpeciality = {
  rotation_speciality_id: number;
  used_dates: Array<DatesRotationDatesResult>;
};

export type StudentRotation = {
  student_user_id: number;
  name: string;
  lastname: string;
  rotation_dates: Array<RotationDatesStudents>;
};

export type RotationDatesStudents = {
  rotation_date_id: number;
  speciality?: SpecialityItem;
  start_date: string;
  finish_date: string;
};

export type GroupInRotation = {
  group_id: number;
  name: string;
  professor_user: UserInRotation;
  group_detail: Array<GroupDetailInRotation>;
  rotation: Array<RotationInRotation>;
};

export type UserInRotation = {
  user_id: number;
  name: string;
  lastname: string;
};

export type GroupDetailInRotation = {
  user: UserInRotation;
};

export type RotationInRotation = {
  rotation_id: number;
  start_date: Date;
  finish_date: Date;
  rotation_speciality: Array<RotationSpecialityInRotation>;
};

export type RotationSpecialityInRotation = {
  rotation_speciality_id: number;
  speciality: SpecialityInRotation;
};

export type SpecialityInRotation = {
  description: string;
};
