import * as moment from 'moment';
import * as Yup from 'yup';
import { Gender } from '../entities/student.entity';

export function getAge(birthday: Date) {
  return moment().diff(birthday, 'years');
}

export const StudentValidationSchema = Yup.object().shape({
  name: Yup.string().nullable(),
  gender: Yup.string().test(
    'is-gender',
    `Gender must be ${Gender.MALE} or ${Gender.FEMALE} or ${Gender.OTHER}`,
    (value) =>
      value === undefined ||
      value === Gender.MALE ||
      value === Gender.FEMALE ||
      value === Gender.OTHER,
  ),
  address: Yup.string().nullable(),
  mobileNo: Yup.string()
    .nullable()
    .test(
      'is-telephone-number',
      'MobileNo must be a nine number prefixed by country code or 0 (e.g. 0123456789 or +94123456789',
      (value) =>
        value === undefined ||
        (typeof value === 'string' &&
          /^(\+\d{2}|0)\d{9}$/.test(value as string)),
    ),
  birthday: Yup.date().max(
    new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    'Must be at least 18 years old',
  ),
  age: Yup.number()
    .nullable()
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .min(18, 'Student needs to be 18 years or older')
    .test(
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

export const RequiredStudentValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is empty'),
  gender: Yup.string().required('Gender is empty'),
  address: Yup.string().required('Address is empty'),
  mobileNo: Yup.string().required('Mobile No is empty'),
  birthday: Yup.date().required('Birthday is empty'),
  age: Yup.number().required('Age is empty'),
});

export const IdValidationSchema = Yup.object().shape({
  id: Yup.number()
    .required('Id is empty')
    .positive('Id must be positive')
    .integer('Id must be integer'),
});

export const UserValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is empty'),
  lastName: Yup.string().required('Last Name is empty'),
  email: Yup.string().required('Email is empty').email('Email is invalid'),
  password: Yup.string().required('Password is empty'),
});

export const SignInUserValidationSchema = Yup.object().shape({
  email: Yup.string().required('Email is empty'),
  password: Yup.string().required('Password is empty'),
});
