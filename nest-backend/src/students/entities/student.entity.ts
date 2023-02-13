import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number | undefined;
  @Column('text')
  address: string | undefined;
  @Column('int')
  age: number | undefined;
  @Column('text')
  birthday: Date | undefined;
  @Column('text')
  gender: string | undefined;
  @Column('text')
  mobileNo: string | undefined;
  @Column('text')
  name: string | undefined;
}
