import moment from "moment/moment";

export function getBeforeDate(year: number) {
  const currentDate = new Date();
  return new Date(currentDate.getFullYear() - year, currentDate.getMonth(), currentDate.getDate());
}

export function getAge(birthday: Date) {
  return moment().diff(birthday, "years");
}
