import { AppDataSource } from "../config/database";
import { Role } from "../models/Role";
import { RoleInterface } from "../interfaces/role.interface";

const roleRepository = AppDataSource.getRepository(Role);

export class RoleService {
    static async getRoles() {
        return await roleRepository.find();
    }

    static async getRoleById(id: number) {
        return await roleRepository.findOne({ where: { id } });
    }

    static async createRole(role: RoleInterface) {
        const createdRole = roleRepository.create(role);
        await roleRepository.save(role);
        return createdRole;
    }

    static async updatedRole(id: number, newRole: RoleInterface) {
        const role = await roleRepository.findOne({ where: { id } });
        if (!role) throw new Error("Rol no encontrado");
        if (newRole.name) role.name = newRole.name;
        await roleRepository.save(role);
        return role;
    }

    static async deleteRole(id: number) {
        const role = await roleRepository.findOne({ where: { id } });
        if (!role) throw new Error("Rol no encontrado!");
        await roleRepository.remove(role);
    }
}

