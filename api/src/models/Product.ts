import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./Category";
import { Detail } from "./Detail";


@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    @IsNotEmpty()
    @MaxLength(100)
    name!:string;

    
    @Column()
    @MaxLength(100)
    description!:string;

    
    @Column()
    @IsNotEmpty()
    stock!:number;

    @Column()
    @IsNotEmpty()
    price!:number;

    @Column({ nullable: true }) // Permite valores nulos
    @IsOptional() // Indica que el campo es opcional en las validaciones
    image!:string;

    @ManyToOne(()=>Category,category=>category.products)
    category!:Category

    @OneToMany(()=>Detail,detail=>detail.product)
    details!:Detail[]
}