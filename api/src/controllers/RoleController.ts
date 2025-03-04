import { Response,Request } from "express";
import { RoleService } from "../services/RoleService";

export class RoleController{
    static async getRoles(req:Request,res:Response){
      const roles=await RoleService.getRoles();
      res.status(200).json(roles);
    }

    static async getRole(req:Request,res:Response){
        const role=await RoleService.getRoleById(Number(req.params.id));
        res.status(200).json(role);
    }

    static async createRole(req:Request,res:Response){
        try{
            const role=await RoleService.createRole(req.body);
            res.status(201).json({
                message:"Rol creado correctamente!",
                role
            })
        }catch(error){
            res.status(500).json({ error: error instanceof Error ? error.message : "Error al crear rol" });
        }
       
    }

    static async updatedRole(req:Request,res:Response){
        try {

            const role=await RoleService.updatedRole(Number(req.params.id),req.body);
            res.status(200).json({
                message:"Rol actualizado correctamente",
                role
            });

        } catch (error) {
            res.status(500).json({error:error instanceof Error ? error.message : "Error al actualizar rol"});
        }
    }

    static async deleteRole(req:Request,res:Response){
       await RoleService.deleteRole(Number(req.params.id));
       res.status(200).json({
        message:"Rol eliminado correctamente"
       })
    }
}