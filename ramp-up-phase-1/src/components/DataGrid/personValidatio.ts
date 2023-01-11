import {Gender} from "./person";
import * as Yup from 'yup';

const userValidationSchema = Yup.object().shape({
    id: Yup.number()
        .required("Id is empty")
        .test(
            "is-number",
            "Id must be a number",
            (value: any) => typeof value === "number"
        )
        .positive('Id must be positive')
        .integer('Id must be an integer')
    ,
    name: Yup.string()
        .required("Name is empty"),
    gender: Yup.string()
        .required("Gender is empty")
        .test(
            "is-gender",
            "Gender must be male or female",
            (value) => value===Gender .MALE || value===Gender.FEMALE
        ),
    address: Yup.string()
        .required("Address is empty"),
    mobileNo: Yup.string()
        .required("Mobile No is empty")
        .test(
            "is-telephone-number",
            "MobileNo must be a ten number",
            (value) => typeof value==='string' && /^\d+$/.test(value as string)  && value.length===10
        ),
    age: Yup.number()
        .positive('Age must be positive')
        .integer('Age must be an integer')
        .min(18, 'Student needs to be 18 years or older'),
});



export default  userValidationSchema;