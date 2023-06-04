import dayjs from 'dayjs';

export const formatDate = (datetime: Date, format: string) => {
  return dayjs(datetime).format(format);
};
