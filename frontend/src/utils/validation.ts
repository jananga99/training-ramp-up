import { Gender } from "./student";
import * as Yup from "yup";
import yupPassword from "yup-password";
yupPassword(Yup);

const studentValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is empty"),
  gender: Yup.string()
    .required("Gender is empty")
    .test(
      "is-gender",
      `Gender must be ${Gender.MALE} or ${Gender.FEMALE} or ${Gender.OTHER}`,
      (value) => value === Gender.MALE || value === Gender.FEMALE || value === Gender.OTHER
    ),
  address: Yup.string().required("Address is empty"),
  mobileNo: Yup.string()
    .required("Mobile No is empty")
    .test(
      "is-telephone-number",
      "MobileNo must be a nine number prefixed by country code or 0 (e.g. 0123456789 or +94123456789",
      (value) => typeof value === "string" && /^(\+\d{2}|0)\d{9}$/.test(value as string)
    ),
  age: Yup.number()
    .test("is-valid-format", "Invalid birthday format", (value) => value !== -1)
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .min(18, "Student needs to be 18 years or older"),
});

const userValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is empty"),
  lastName: Yup.string().required("Last Name is empty"),
  email: Yup.string().required("Email is empty").email("Enter a valid email"),
  // password: Yup.string().required("Password is empty").password(),
  password: Yup.string().required("Password is empty"),
  confirmPassword: Yup.string()
    .required("Confirm password is empty")
    .oneOf([Yup.ref("password"), null], "Password and Confirm password does not match"),
});

export { studentValidationSchema, userValidationSchema };
