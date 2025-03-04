import { Sale } from "../models/Sale";
import { Detail } from "../models/Detail";
import { User } from "../models/User";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { NotFoundError } from "../errors/NotFoundError";
import { SaleInterface } from "../interfaces/sale.interface";
import { Product } from "../models/Product";

export class SaleService{
    private saleRepository:Repository<Sale>;
    private detailRepository:Repository<Detail>;
    private productRepository:Repository<Product>;
    private userRepository:Repository<User>;

    constructor(){
        this.saleRepository=AppDataSource.getRepository(Sale);
        this.detailRepository=AppDataSource.getRepository(Detail);
        this.productRepository=AppDataSource.getRepository(Product);
        this.userRepository=AppDataSource.getRepository(User);
    }

    async getSales(){
        return await this.saleRepository.find({
            relations:['user']
        });
    }

    async getSale(id:number){
      const foundSale=await this.saleRepository.findOne({
        where:{id},
        relations:['user','details','details.product']
    });
      if(!foundSale) throw new NotFoundError("Venta no encontrada");
      return foundSale;
    }

    async createSale(sale: SaleInterface) {
        const queryRunner = this.saleRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            // Validar que la venta tenga detalles
            if (!sale.details || sale.details.length === 0) {
                throw new Error("La venta debe tener al menos un detalle.");
            }
    
            // Buscar el usuario
            const user = await this.userRepository.findOne({ where: { id: sale.user_id } });
            if (!user) throw new NotFoundError("Usuario no encontrado");
    
            // Crear y guardar la venta
            const saleCreate = this.saleRepository.create({ ...sale, user });
            const saleSaved = await queryRunner.manager.save(saleCreate);
    
            // Crear y guardar los detalles de la venta
            for (const detail of sale.details) {
                const product = await this.productRepository.findOne({ where: { id: detail.product_id } });
                if (!product) throw new NotFoundError("Producto con id: " + detail.product_id + " no encontrado");
                const detailCreate = this.detailRepository.create({ ...detail, product, sale: saleSaved });
                await queryRunner.manager.save(detailCreate);
            }
    
            // Confirmar la transacción
            await queryRunner.commitTransaction();
            return saleSaved;
        } catch (error) {
            // Revertir la transacción en caso de error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Liberar el queryRunner
            await queryRunner.release();
        }
    }

    async getSalesByUser(user_id:number){
        const userExist=await this.userRepository.findOne({where:{id:user_id}});
        if(!userExist) throw new NotFoundError("Usuario no existe");
         const salesByUser=await this.saleRepository.find({
            where:{user:{id:user_id}},
            relations:['details','details.product']
        });

        return salesByUser;
    }

       

    

}