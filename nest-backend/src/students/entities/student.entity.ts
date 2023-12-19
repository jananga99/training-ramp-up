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
  address: string;
  @Column('int')
  age: number;
  @Column('text')
  birthday: Date;
  @Column('text')
  gender: string;
  @Column('text')
  mobileNo: string;
  @Column('text')
  name: string;
}
