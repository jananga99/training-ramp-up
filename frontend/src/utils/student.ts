enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

type NewStudent = {
  name: string;
  gender: string;
  address: string;
  mobileNo: string;
  birthday: Date;
  age: number;
};

interface Student {
  id: number;
  name?: string;
  gender?: string;
  address?: string;
  mobileNo?: string;
  birthday?: Date;
  age?: number;
}

type GridStudent = Student & {
  keyId: number | null;
  isAdding: boolean;
  isEditing: boolean;
  inEdit: boolean;
};

export { Gender };
export type { GridStudent, NewStudent, Student };
