import { Gender } from "../student";
import * as yup from "yup";
import yupPassword from "yup-password";
yupPassword(yup);

const studentValidationSchema = yup.object().shape({
  name: yup.string().required("Name is empty"),
  gender: yup
    .string()
    .required("Gender is empty")
    .test(
      "is-gender",
      `Gender must be ${Gender.MALE} or ${Gender.FEMALE} or ${Gender.OTHER}`,
      (value) => value === Gender.MALE || value === Gender.FEMALE || value === Gender.OTHER
    ),
  address: yup.string().required("Address is empty"),
  mobileNo: yup
    .string()
    .required("Mobile No is empty")
    .test(
      "is-telephone-number",
      "MobileNo must be a ten number",
      (value) => typeof value === "string" && /^\d+$/.test(value as string) && value.length === 10
    ),
  age: yup
    .number()
    .test("is-valid-format", "Invalid birthday format", (value) => value !== -1)
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .min(18, "Student needs to be 18 years or older"),
  email: yup.string().required("Email is empty").email("Enter a valid email"),
  password: yup.string().required("Password is empty").password(),
  confirmPassword: yup
    .string()
    .required("Confirm password is empty")
    .oneOf([yup.ref("password"), null], "Password and Confirm password does not match"),
});

const userValidationSchema = yup.object().shape({
  email: yup.string().required("Email is empty").email("Enter a valid email"),
  password: yup.string().required("Password is empty").password(),
  confirmPassword: yup
    .string()
    .required("Confirm password is empty")
    .oneOf([yup.ref("password"), null], "Password and Confirm password does not match"),
});

export { studentValidationSchema, userValidationSchema };
