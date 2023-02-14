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
  @Column('text', { nullable: true })
  address: string;
  @Column('int', { nullable: true })
  age: number;
  @Column('text', { nullable: true })
  birthday: Date;
  @Column('text', { nullable: true })
  gender: string;
  @Column('text', { nullable: true })
  mobileNo: string;
  @Column('text', { nullable: true })
  name: string;
}
