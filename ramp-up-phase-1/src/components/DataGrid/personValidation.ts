import {Gender} from "./person";
import * as Yup from 'yup';

const userValidationSchema = Yup.object().shape({
    id: Yup.number()
        .required("Id is empty")
        .positive('Id must be positive')
        .integer('Id must be an integer')
    ,
    name: Yup.string()
        .required("Name is empty")
        .test(
            "is-empty",
            "Name cannot be empty",
            (value) => value!==undefined && value.length>0
        ),
    gender: Yup.string()
        .required("Gender is empty")
        .test(
            "is-gender",
            `Gender must be ${Gender.MALE} or ${Gender.FEMALE} or ${Gender.OTHER}`,
            (value) => value===Gender .MALE || value===Gender.FEMALE || value===Gender.OTHER
        ),
    address: Yup.string()
        .required("Address is empty")
        .test(
            "is-empty",
            "Address cannot be empty",
            (value) => value!==undefined && value.length>0
        ),
    mobileNo: Yup.string()
        .required("Mobile No is empty")
        .test(
            "is-telephone-number",
            "MobileNo must be a ten number",
            (value) => typeof value==='string' && /^\d+$/.test(value as string)  && value.length===10
        ),
    age: Yup.number()
        .test(
            "is-valid-format",
            "Invalid birthday format",
            (value) => value!==-1
        )
        .positive('Age must be positive')
        .integer('Age must be an integer')
        .min(18, 'Student needs to be 18 years or older'),
});

const getDateFromBirthday = (birthday:string)=>{
    if(birthday === null || birthday === undefined){
        return ''
    }
    const arr = birthday.split(' ')
    let month = ''
    if(!["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(arr[0] as never)){
        console.log('Invalid Day')
        return ''
    }else if(!["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Sep", "Oct", "Nov", "Dec"].includes(arr[1] as never)){
        console.log('Invalid Month')
        return ''
    }
    switch (arr[1]) {
        case "Jan":
            month='1'
            break
        case "Feb":
            month='2'
            break
        case "Mar":
            month='3'
            break
        case "Apr":
            month='4'
            break
        case "May":
            month='5'
            break
        case "Jum":
            month='6'
            break
        case "Jul":
            month='7'
            break
        case "Aug":
            month='8'
            break
        case "Sep":
            month='9'
            break
        case "Oct":
            month='10'
            break
        case "Nov":
            month='11'
            break
        case "Dec":
            month='12'
            break
    }
    return arr[3]+"-"+month+"-"+arr[2]
}

export {getDateFromBirthday, userValidationSchema}