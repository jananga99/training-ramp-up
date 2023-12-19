import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('text')
  email: string;
  @Column('boolean')
  isAdmin: boolean;
  @Column('text')
  password: string;
  @Column('text')
  firstName: string;
  @Column('text')
  lastName: string;
  @Column('text')
  timestamp: number;
}
