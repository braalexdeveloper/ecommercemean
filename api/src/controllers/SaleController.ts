import { NotFoundError } from "../errors/NotFoundError";
import { SaleService } from "../services/SaleService";
import { Request,Response } from "express";

export class SaleController{
    private saleService:SaleService;
    constructor(){
        this.saleService=new SaleService();
    }
    async getSales(req:Request,res:Response){
     try {
        const sales=await this.saleService.getSales();
        res.status(200).json(sales);
     } catch (error) {
        res.status(500).json({error:error instanceof Error ? error.message : "Error al obtener ventas"});
     }
    }

    async getSale(req:Request,res:Response){
        try {
            const sale=await this.saleService.getSale(Number(req.params.id));
            res.status(200).json(sale);
        } catch (error) {
            if(error instanceof NotFoundError){
                res.status(404).json({error:error.message})
            }else{
                res.status(500).json({error:error instanceof Error ? error.message : "Error al obtener venta"});
            }
        }
    }

    async createSale(req:Request,res:Response){
        try {
            const sale=await this.saleService.createSale(req.body);
            res.status(201).json({
                message:"Venta creado correctamente!",
                sale
            });
        } catch (error) {
            if(error instanceof NotFoundError){
                res.status(404).json({error:error.message})
            }else{
                res.status(500).json({error:error instanceof Error ? error.message : "Error al crear venta"});
            }
        }
    }

    async getSalesByUser(req:Request,res:Response){
        try {
            const sales=await this.saleService.getSalesByUser(Number(req.params.user_id));
            res.status(200).json(sales);
        } catch (error) {
            if(error instanceof NotFoundError){
                res.status(404).json({error:error.message})
            }else{
                res.status(500).json({error:error instanceof Error ? error.message : "Error al obtener ventas del usuario"});
            }
        }
    }
}