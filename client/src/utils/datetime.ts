import moment from "moment-timezone";

export const transform = (date: Date, format: string): string => {
  return moment(date).format(format);
};
