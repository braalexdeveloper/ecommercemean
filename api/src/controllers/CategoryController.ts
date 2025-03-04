import { Request,Response } from "express";
import { CategoryService } from "../services/CategoryService";

export class CategoryController{
  private categoryService:CategoryService;

  constructor(){
    this.categoryService=new CategoryService();
  }

    async getCategories(req:Request,res:Response){
      try {
        const page=(req.query.page && Number(req.query.page)>0) ? Number(req.query.page) : undefined;
        const limit=(req.query.limit && Number(req.query.limit)>0) ? Number(req.query.limit) : undefined;
        const categories=await this.categoryService.getCategories(page,limit);
        res.status(200).json(categories);
      } catch (error) {
        res.status(500).json({error:error instanceof Error ? error.message : "Error al obtener categories"})
      }
    }

     async getCategory(req:Request,res:Response):Promise<any>{
     try {
        const category=await this.categoryService.getCategory(Number(req.params.id));
        if(!category) return res.status(404).json({error:"Categoria no encontradaa!!"});
        return res.status(200).json({category});
     } catch (error) {
        return res.status(500).json({error:error instanceof Error ? error.message : "Error al obtener categoria"})
     }
    }

   createCategory= async (req:Request,res:Response)=>{
  try {
    const category=await this.categoryService.createCategory(req.body);
    res.status(201).json({
        message:"Categoria creado correctamente!",
        category
    });

  } catch (error) {
    res.status(500).json({error:error instanceof Error ? error.message : "Error al crear categoria"})
  }
    }

     async updatedCategory(req:Request,res:Response){
        try {
            const category= await this.categoryService.updateCategory(Number(req.params.id),req.body);
            res.status(200).json({
                message:"Categoria actualizada correctamente!",
                category
            })
        } catch (error) {
            res.status(500).json({error:error instanceof Error ? error.message : "Error al actualizar categoria"})
        }
    }

     async deleteCategory(req:Request,res:Response){
        try {
            const category= await this.categoryService.getCategory(Number(req.params.id));
            if(!category){
                res.status(404).json({error:"Categoria no encontrada!!"});
                return;
            }
            await this.categoryService.deleteCategory(Number(req.params.id));
            res.status(200).json({
                message:"Categoria eliminado correctamente!",
                })
        } catch (error) {
            res.status(500).json({error:error instanceof Error ? error.message : "Error al eliminar categoria"})
        }
    }
}