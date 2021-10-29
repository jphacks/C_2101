import moment from "moment";

export const transform = (date: Date, format: string): string => {
  return moment(date).format(format);
};
