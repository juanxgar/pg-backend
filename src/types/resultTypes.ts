import { UserItem } from './entitiesTypes';

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

export type UsedDatesRotationResult = {
  start_date: Date;
  finish_date: Date;
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
