import { Entity,PrimaryGeneratedColumn,Column, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Sale } from "./Sale";

@Entity()
export class Detail{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    subtotal!:number;

    @Column()
    quantity!:number;

    @ManyToOne(()=>Product,product=>product.details)
    product!:Product

    @ManyToOne(()=>Sale,sale=>sale.details)
    sale!:Sale
}