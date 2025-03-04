import { NotFoundError } from "../errors/NotFoundError";
import { ProductService } from "../services/ProductService";
import { Request,Response } from "express";
import { ValidationError } from "class-validator";

export class ProductController{
    private productService:ProductService;

    constructor(){
        this.productService=new ProductService();
    }

    async getProducts(req:Request,res:Response){
      try { 
        const page=req.query.page ? Number(req.query.page) : undefined;
        const limit=req.query.limit ? Number(req.query.limit) : undefined;
        const products=await this.productService.getProducts(page,limit);
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({error:error instanceof Error ? error.message : "Error al obtener productos"});
      }
    }

    async getProduct(req:Request,res:Response){
        try {
            const product=await this.productService.getProduct(Number(req.params.id));
            res.status(200).json(product);
        } catch (error) {
            if(error instanceof NotFoundError){
            res.status(404).json({error:error.message});
            }else{
                res.status(500).json({error:error instanceof Error ? error.message : "Error al obtener productos"});
            }
            
        }
    }

    async createProduct(req:Request,res:Response){
        try {
            
            req.body.image=req.file ? req.file.path : null;
            const product=await this.productService.createProduct(req.body);
            res.status(201).json({
                message:"Producto creado correctamente!",
                product
            });
        } catch (error) {
            if (error instanceof Array && error[0] instanceof ValidationError) {
                // Si es un error de validación, devuelve los detalles
                res.status(400).json({
                    error: "Error de validación",
                    details: error.map(err => ({
                        property: err.property,
                        constraints: err.constraints,
                    })),
                });
            }else{
                res.status(500).json({error:error instanceof Error ? error.message : "Error al obtener productos"});
            } 
            
        }
    }

    async updatedProduct(req:Request,res:Response){
     try {
        req.body.image=req.file ? req.file.path : null;
        const updatedProduct=await this.productService.updateProduct(Number(req.params.id),req.body);
        res.status(200).json({
            message:"Producto actualizado correctamente!",
            product:updatedProduct
        });
     } catch (error) {
        if(error instanceof NotFoundError){
           res.status(404).json({error:error.message});
        }else if (error instanceof Array && error[0] instanceof ValidationError) {
            // Si es un error de validación, devuelve los detalles
            res.status(400).json({
                error: "Error de validación",
                details: error.map(err => ({
                    property: err.property,
                    constraints: err.constraints,
                })),
            });
        }else{
            res.status(500).json({error:error instanceof Error ? error.message : "Error al actualizar producto"});
        }
     }
    }

    async deleteProduct(req:Request,res:Response){
        try {
            await this.productService.deleteProduct(Number(req.params.id));
            res.status(200).json({
                message:"Producto eliminado correctamente!"
            
            });
        } catch (error) {
            if(error instanceof NotFoundError){
                res.status(404).json({ error: error.message });
            }else{
                res.status(500).json({error:error instanceof Error ? error.message : "Error al eliminar producto"});
            }
           
        }
    }
}