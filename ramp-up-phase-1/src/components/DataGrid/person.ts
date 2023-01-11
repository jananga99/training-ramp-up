enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

type Person =  {
    id: number,
    name: string,
    gender: Gender,
    address: string,
    mobileNo: string,
    birthday: string,
    age: number
}

export {Gender}
export type { Person }
