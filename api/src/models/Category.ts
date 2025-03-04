import { Entity,PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";
import { IsNotEmpty, MaxLength } from "class-validator";
import { Product } from "./Product";

@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({length:100})
    @IsNotEmpty()
    @MaxLength(100)
    name!:string;

    @OneToMany(()=>Product,product=>product.category)
    products!:Product[];
}
