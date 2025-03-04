import { Entity,PrimaryGeneratedColumn,Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { Detail } from "./Detail";

@Entity()
export class Sale{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    @IsNotEmpty()
    date!:string;

    @Column()
    @IsNotEmpty()
    total!:number;

    @ManyToOne(()=>User,user=>user.sales)
    user!:User

    @OneToMany(()=>Detail,detail=>detail.sale)
    details!:Detail[]
}