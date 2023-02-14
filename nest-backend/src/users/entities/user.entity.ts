import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('text')
  email: string;
  @Column('boolean', { nullable: true })
  isAdmin: boolean;
  @Column('text', { nullable: true })
  password: string;
  @Column('text', { nullable: true })
  firstName: string;
  @Column('text', { nullable: true })
  lastName: string;
  @Column('text', { nullable: true })
  timestamp: number;
}
