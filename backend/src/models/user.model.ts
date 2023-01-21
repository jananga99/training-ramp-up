import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryColumn('text')
  email: string | undefined
  @Column('text')
  password: string | undefined
  @Column('text')
  timestamp: number | undefined
}
