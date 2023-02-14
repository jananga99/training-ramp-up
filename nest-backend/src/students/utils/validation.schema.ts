import * as moment from 'moment';
import * as Yup from 'yup';
import { Gender } from '../entities/student.entity';

export function getAge(birthday: Date) {
  return moment().diff(birthday, 'years');
}

export const StudentValidationSchema = Yup.object().shape({
  birthday: Yup.date().max(
    new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    'Must be at least 18 years old',
  ),
  mobileNo: Yup.string().test(
    'is-telephone-number',
    'MobileNo must be a nine number prefixed by country code or 0 (e.g. 0123456789 or +94123456789',
    (value) =>
      value === undefined ||
      (typeof value === 'string' && /^(\+\d{2}|0)\d{9}$/.test(value as string)),
  ),
  age: Yup.number().test(
    'is match with age',
    'Age must be compatible with the birthday',
    function (value) {
      return (
        (value === undefined && this.parent.birthday === undefined) ||
        value === getAge(this.parent.birthday)
      );
    },
  ),
});

export const IdValidationSchema = Yup.object().shape({
  id: Yup.number()
    .required('Id is empty')
    .positive('Id must be positive')
    .integer('Id must be integer'),
});
