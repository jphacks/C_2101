import moment from "moment";

export const transform = (date: Date, format: string): string => {
  return moment(date).format(format);
};

export const parseAsMoment = (dateTimeStr:Date) => {
    return moment.utc(dateTimeStr, "YYYY-MM-DDTHH:mm:00Z", "ja").utcOffset(9);
  };