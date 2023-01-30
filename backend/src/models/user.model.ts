import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryColumn('text')
  email: string | undefined
  @Column('boolean')
  isAdmin: boolean | undefined
  @Column('text')
  password: string | undefined
  @Column('text')
  firstName: string | undefined
  @Column('text')
  lastName: string | undefined
  @Column('text')
  timestamp: number | undefined
}
