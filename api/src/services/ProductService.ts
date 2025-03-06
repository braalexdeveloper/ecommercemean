import fs from "fs";
import path from "path";
import { Between, Repository } from "typeorm";
import { Product } from "../models/Product";
import { AppDataSource } from "../config/database";
import { ProductInterface } from "../interfaces/product.interface";
import { Category } from "../models/Category";
import { NotFoundError } from "../errors/NotFoundError";
import { validateOrReject } from "class-validator";

export class ProductService {
    private productRepository: Repository<Product>;
    private categoryRepository: Repository<Category>;

    constructor() {
        this.productRepository = AppDataSource.getRepository(Product);
        this.categoryRepository = AppDataSource.getRepository(Category);
    }

    async getProducts(page:number=1,limit:number=10,idCategory:number=0,orderPrice:string,minPrice?:number,maxPrice?:number):Promise<{data:Product[],total:number,page:number,totalPages:number}> {

        const skip=(page-1)*limit;
        const whereCondition: any = {};

        // Filtro por categoría si se proporciona idCategory
        if (idCategory) {
          whereCondition.category = { id: idCategory };
        }
      
        // Filtro por rango de precios si se proporcionan minPrice y maxPrice
        if (minPrice !== undefined && maxPrice !== undefined) {
          whereCondition.price = Between(minPrice, maxPrice);
        } else if (minPrice !== undefined) {
          whereCondition.price = { $gte: minPrice };
        } else if (maxPrice !== undefined) {
          whereCondition.price = { $lte: maxPrice };
        }
        
        const orderCondition:any={};
        if(orderPrice==='asc'){
            orderCondition.price='ASC';
        }else if(orderPrice==='desc'){
           orderCondition.price='DESC';
        }else {
            orderCondition.id = 'DESC'; // Orden por defecto por ID en orden descendente
          }
        console.log(orderCondition)
        const [data,total]=await this.productRepository.findAndCount({
            skip:Number(skip),
            take:limit,
            order:orderCondition,
            relations:['category'],
            where: whereCondition,
        });

        // Log de los datos obtenidos
  console.log("Data:", data);

        const totalPages=Math.ceil(total/limit);

        return {
            data,
            total,
            page,
            totalPages,
        };
    }

    async getProduct(id: number) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundError("Producto no encontrado!");
        return product;
    }
urlImage(pathImage:string){
    // Construir la URL pública de la imagen
    if (pathImage) {
        const imageName = path.basename(pathImage); // Obtener el nombre del archivo
        pathImage = `uploads/${imageName}`;
        return pathImage;
    }
    return null;
}
    async createProduct(product: ProductInterface) {
        const category = await this.categoryRepository.findOne({ where: { id: product.category_id } });
        if (!category) throw new NotFoundError("Categoria no encontrada");
        delete product.category_id;
        
        product.image=this.urlImage(product.image);
        const productCreated = this.productRepository.create({ ...product, category });
        // Valida la entidad antes de guardarla
        await validateOrReject(productCreated);
        await this.productRepository.save(productCreated);
        return productCreated;
    }

    async updateProduct(id: number, product: ProductInterface) {
        const category = await this.categoryRepository.findOne({ where: { id: product.category_id } });
        if (!category) throw new NotFoundError("Categoria no encontrada");
        const foundProduct = await this.productRepository.findOne({ where: { id } });
        if (!foundProduct) throw new NotFoundError("Producto no encontrado");
        delete product.category_id;

        if (product.image) {
            
            // Si el producto ya tiene una imagen, elimínala
            if (foundProduct.image && foundProduct.image.trim() !== "") {
                // Verifica si la ruta es absoluta
                const isAbsolutePath = path.isAbsolute(foundProduct.image);
                const imagePath = isAbsolutePath
                    ? foundProduct.image // Usa la ruta absoluta directamente
                    : path.join(__dirname, '..', foundProduct.image); // Construye la ruta completa si es relativa

                if (fs.existsSync(imagePath)) {
                    try {
                        fs.unlinkSync(imagePath);
                        console.log("Imagen anterior eliminada:", imagePath);
                        product.image=this.urlImage(product.image);
                    } catch (error) {
                        console.error("Error al eliminar la imagen anterior:", error);
                    }
                } else {
                    console.warn("La imagen no existe en la ruta:", imagePath);
                }
            }
        } else {
            // Si no se envía una nueva imagen, elimina la propiedad `image` del objeto `product`
            delete product.image;
        }

        Object.assign(foundProduct, { ...product, category });
        await validateOrReject(foundProduct);
        this.productRepository.save(foundProduct);
        return foundProduct;
    }

    async deleteProduct(id: number) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundError("Producto no encontrado");
        await this.productRepository.remove(product);
    }
}