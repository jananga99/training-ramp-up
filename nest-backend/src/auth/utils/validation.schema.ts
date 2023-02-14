import * as Yup from 'yup';

export const SignUpValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is empty'),
  lastName: Yup.string().required('Last Name is empty'),
  email: Yup.string().required('Email is empty').email('Email is invalid'),
  password: Yup.string().required('Password is empty'),
});

export const SignInValidationSchema = Yup.object().shape({
  email: Yup.string().required('Email is empty'),
  password: Yup.string().required('Password is empty'),
});
