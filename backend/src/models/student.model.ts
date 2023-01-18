import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
class Student {
  @PrimaryGeneratedColumn()
  dbId: number | undefined
  @Column('text')
  address: string | undefined
  @Column('int')
  age: number | undefined
  @Column('text')
  birthday: Date | undefined
  @Column('text')
  gender: string | undefined
  @Column('int')
  id: number | undefined
  @Column('text')
  mobileNo: string | undefined
  @Column('text')
  name: string | undefined
}

export { Gender }
export { Student }
