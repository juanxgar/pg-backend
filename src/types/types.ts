import { PaginatedResult } from './resultTypes';

export type RotationDates = {
  start_date: string;
  finish_date: string;
};

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};
export type PaginateFunction = <T, K>(
  model: any,
  options?: PaginateOptions,
  args?: K,
) => Promise<PaginatedResult<T>>;
