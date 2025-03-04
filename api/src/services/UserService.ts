import { AppDataSource } from "../config/database";
import { generateToken } from "../config/jwt";
import { NotFoundError } from "../errors/NotFoundError";
import { IUser } from "../interfaces/IUser";
import { Role } from "../models/Role";
import { User } from "../models/User";
import bcrypt from 'bcryptjs';

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);

export class UserService {
    
    static async getUsers() {
        return await userRepository.find({ relations: ["role"] });
    }

    static async getUserById(id: number) {
        return await userRepository.findOne({ where: { id }, relations: ["role"] });
    }

    static async createUser(email: string, password: string, roleId: number) {
        const role = await roleRepository.findOne({ where: { id: roleId } });
        if (!role) throw new Error("Rol no encontrado");
        password=await bcrypt.hash(password,10);
        const user = userRepository.create({ email, password, role });
        await userRepository.save(user);
        return user;
    }

    static async updateUser(id: number, newData: Partial<IUser>) {
        const user = await userRepository.findOne({ where: { id }, relations: ["role"] });
        if (!user) throw new Error("Usuario no encontrado");
    
        if (newData.email) user.email = newData.email;
        if (newData.password) user.password = await bcrypt.hash(newData.password,10);
    
        if (newData.roleId) {
            const role = await roleRepository.findOne({ where: { id: newData.roleId } });
            if (!role) throw new Error("Rol no encontrado");
            user.role = role;
        }
    
        await userRepository.save(user);
        return user;
    }

    static async deleteUser(id: number) {
        const user = await userRepository.findOne({ where: { id } });
        if (!user) throw new Error("Usuario no encontrado");
    
        await userRepository.remove(user);
    }
    
    async login(email:string,password:string){
      const userExist=await userRepository.findOne({where:{email}});
      if(!userExist) throw new NotFoundError("Usuario no encontrado");
      const isPasswordValid=await bcrypt.compare(password,userExist.password);
      if(!isPasswordValid) throw new Error("Contraseña Incorrecta!");
      const token=generateToken(userExist.id.toString());
      return {user:userExist,token};
    }

    async regsiter(user:IUser){
      const userExist=await userRepository.findOne({where:{email:user.email}});
      if(userExist) throw new Error("Este usuario ya existe!");
      const role=await roleRepository.findOne({where:{name:"client"}});
      if(!role) throw new NotFoundError("Rol no encontrado");
      user.password=await bcrypt.hash(user.password,10);
      const userCreate=userRepository.create({...user,role});
      await userRepository.save(userCreate);
      return userCreate;
    }
}