import { Gender } from "./student";
import * as Yup from "yup";

const userValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is empty")
    .test("is-empty", "Name cannot be empty", (value) => value !== undefined && value.length > 0),
  gender: Yup.string()
    .required("Gender is empty")
    .test(
      "is-gender",
      `Gender must be ${Gender.MALE} or ${Gender.FEMALE} or ${Gender.OTHER}`,
      (value) => value === Gender.MALE || value === Gender.FEMALE || value === Gender.OTHER
    ),
  address: Yup.string()
    .required("Address is empty")
    .test(
      "is-empty",
      "Address cannot be empty",
      (value) => value !== undefined && value.length > 0
    ),
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

export { userValidationSchema };
