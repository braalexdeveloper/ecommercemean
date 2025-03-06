import { Response, Request } from "express";
import { UserService } from "../services/UserService";

export class UserController {
    
    static async getUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Error al obtener usuarios" });
        }
    }

    static async getUser(req:Request,res:Response):Promise<any>{
        const user=await UserService.getUserById(Number(req.params.id));
        if(!user) res.status(404).json({error:"Usuario no encontrado!"})
        return res.status(200).json({user});
    }

    static async createUser(req: Request, res: Response):Promise<any> {
        try {
            const { email, password, roleId } = req.body;
            const user = await UserService.createUser(email, password, roleId);
            return res.status(201).json({ 
                message: "Usuario creado con éxito!", 
                user 
            });
        } catch (error) {
            return res.status(400).json({ error: error instanceof Error ? error.message : "Ocurrió un error desconocido" });
        }
    }

    static async updateUser(req: Request, res: Response): Promise<any> {
        try {
            const id = Number(req.params.id);
            const { email, password, roleId } = req.body;
    
            const userExists = await UserService.getUserById(id);
            if (!userExists) {
                return res.status(404).json({ error: "Usuario no encontrado!" });
            }
    
            const updatedUser = await UserService.updateUser(id, { email, password, roleId });
            return res.status(200).json({ message: "Usuario actualizado con éxito!", user: updatedUser });
    
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : "Error al actualizar usuario" });
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<any> {
        try {
            const id = Number(req.params.id);
    
            const userExists = await UserService.getUserById(id);
            if (!userExists) {
                return res.status(404).json({ error: "Usuario no encontrado!" });
            }
    
            await UserService.deleteUser(id);
            return res.status(200).json({ message: "Usuario eliminado con éxito!" });
    
        } catch (error) {
            return res.status(500).json({ error: error instanceof Error ? error.message : "Error al eliminar usuario" });
        }
    }
  
    
    static async hello(req: Request, res: Response): Promise<any> {
        return res.json({ message: "Hola mundo"  });
        
    }

}
