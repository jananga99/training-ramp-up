import { Gender } from "./student";
import * as Yup from "yup";
import yupPassword from "yup-password";
import { getAge } from "./helpers";
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
  birthday: Yup.date()
    .required("Birthday is empty")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      "Must be at least 18 years old"
    ),
  age: Yup.number()
    .test("is-valid-format", "Invalid birthday format", (value) => value !== -1)
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .min(18, "Student needs to be 18 years or older")
    .test("is match with age", "Age must be compatible with the birthday", function (value) {
      return value === getAge(this.parent.birthday);
    }),
});

const userValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is empty"),
  lastName: Yup.string().required("Last Name is empty"),
  email: Yup.string().required("Email is empty").email("Enter a valid email"),
  password: Yup.string().required("Password is empty").password(),
  confirmPassword: Yup.string()
    .required("Confirm password is empty")
    .oneOf([Yup.ref("password"), null], "Password and Confirm password does not match"),
});
const signInUserValidationSchema = Yup.object().shape({
  email: Yup.string().required("Email is empty"),
  password: Yup.string().required("Password is empty"),
});

export { studentValidationSchema, userValidationSchema, signInUserValidationSchema };
