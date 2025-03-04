import { Entity,PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({length:50})
    name!:string

    @OneToMany(()=>User,user=>user.role)
    users!:User[];
}