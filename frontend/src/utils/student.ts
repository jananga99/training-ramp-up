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

type Student = {
  id: number;
  name: string;
  gender: string;
  address: string;
  mobileNo: string;
  birthday: Date;
  age: number;
};

type GridStudent = {
  keyId: number | null;
  id: number | null;
  name: string | null;
  gender: string | null;
  address: string | null;
  mobileNo: string | null;
  birthday: Date;
  age: number | null;
  isAdding: boolean;
  isEditing: boolean;
  inEdit: boolean;
};

export { Gender };
export type { GridStudent, NewStudent, Student };
