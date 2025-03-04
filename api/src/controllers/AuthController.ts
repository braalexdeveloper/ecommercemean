import { Request,Response } from "express";
import { UserService } from "../services/UserService";
import { NotFoundError } from "../errors/NotFoundError";

export class AuthController{
    private userService:UserService;

    constructor(){
        this.userService=new UserService();
    }

    async login(req:Request,res:Response){
       try {
        const result=await this.userService.login(req.body.email,req.body.password);
        res.status(200).json(result);
       } catch (error) {
        if(error instanceof NotFoundError){
            res.status(404).json({error:error.message});
        }else{
            res.status(500).json({error:error instanceof Error ? error.message : "Error al loguearse"})
        }
       }
    }

    async register(req:Request,res:Response){
        try {
            const user=await this.userService.regsiter(req.body);
            res.status(201).json({
                message:"Usuario creado correctamente!",
                user
            })
        } catch (error) {
           
        res.status(500).json({error:error instanceof Error ? error.message : "Error al registrarse"})
            
        }
    }
}