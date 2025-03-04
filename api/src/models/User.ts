import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Role } from './Role';
import { Sale } from './Sale';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ManyToOne(()=>Role,role=>role.users)
  role!:Role

  @OneToMany(()=>Sale,sales=>sales.user)
  sales!:Sale[]
}