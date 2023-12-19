import * as moment from 'moment/moment';

export function getAge(birthday: Date) {
  return moment().diff(birthday, 'years');
}
