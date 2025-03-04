import { DetailInterface } from "./detail.interface";

export interface SaleInterface{
    id?:number;
    date:string;
    total:number;
    user_id:number;
    details:DetailInterface[];
}