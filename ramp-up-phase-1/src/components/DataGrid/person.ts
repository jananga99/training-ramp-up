enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

type Person =  {
    id: number | null,
    name: string | null,
    gender: string | null,
    address: string | null,
    mobileNo: string | null,
    birthday: string | null,
    age: number | null,
    tempId: number | null
}

export {Gender}
export type { Person }
