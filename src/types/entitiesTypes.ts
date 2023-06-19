export type GroupItem = {
  group_id: number;
  name: string;
  state: boolean;
  professor_user: UserItem;
  group_detail?: Array<GroupDetailItem>;
};

export type GroupDetailItem = {
  group_detail_id: number;
  user: UserItem;
};

export type UserItem = {
  user_id: number;
  name: string;
  lastname: string;
  identification: number;
  role: string;
  code: string;
  email: string;
  state: boolean;
  reset_password_token?: string;
};

export type LocationItem = {
  location_id: number;
  adress: string;
  city: string;
  complexity: string;
  name: string;
  state: boolean;
  total_capacity: number;
  location_speciality?: Array<LocationSpecialityItem>;
};

export type LocationSpecialityItem = {
  location_speciality_id: number;
  limit_capacity: number;
  state: boolean;
  speciality: SpecialityItem;
};

export type SpecialityItem = {
  speciality_id: number;
  description: string;
  state: boolean;
};

export type DescriptionExamItem = {
  description_exam_id: number;
  description: string;
  subdescription_exam: Array<SubdescriptionExamItem>;
};

export type SubdescriptionExamItem = {
  subdescription_exam_id: number;
  subdescription: string;
};

export type RotationItem = {
  rotation_id: number;
  semester: number;
  start_date: Date;
  finish_date: Date;
  state: boolean;
  group: GroupItem;
  location: LocationItem;
  rotation_speciality?: Array<RotationSpecialityItem>;
};

export type RotationSpecialityItem = {
  rotation_speciality_id: number;
  professor: UserItem;
  speciality: SpecialityItem;
};

export type RotationDateItem = {
  rotation_date_id: number;
  student: UserItem;
  rotation_speciality: RotationSpecialityItem;
}
