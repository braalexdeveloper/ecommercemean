import { Category } from "../models/Category";
import { CategoryInterface } from "../interfaces/category.interface";
import { AppDataSource } from "../config/database";
import { Repository } from "typeorm";


export class CategoryService{
  private categoryRepository:Repository<Category>;

  constructor(){
    this.categoryRepository=AppDataSource.getRepository(Category);
  }

  async getCategories(page:number=1,limit:number=5):Promise<{data:Category[],total:number,page:number,totalPages:number}> {

    const skip=(page-1)*limit;

    const [data,total]=await this.categoryRepository.findAndCount({
      skip:skip,
      take:limit,
      order:{
        id:'DESC'
      }
      
    });
    const totalPages=Math.ceil(total/limit);

    return {
      data,
      total,
      totalPages,
      page
    };
}

async getCategory(id: number) {
    return await this.categoryRepository.findOne({ where: { id } });
}

async createCategory(category: CategoryInterface) {
    const createdCategory = this.categoryRepository.create(category);
    await this.categoryRepository.save(createdCategory);
    return createdCategory;
}

async updateCategory(id: number, category: Partial<Category>) {
  const categoryFound = await this.categoryRepository.findOne({ where: { id } });
  if (!categoryFound) throw new Error("Categoria no encontrada");

  // Actualiza solo las propiedades proporcionadas
  Object.assign(categoryFound, category);

  // TypeORM valida automáticamente antes de guardar
  await this.categoryRepository.save(categoryFound);
  return categoryFound;
}

async deleteCategory(id: number) {
    const categoryFound = await this.categoryRepository.findOne({ where: { id } });
    if (!categoryFound) throw new Error("Categoria no encontrada");
    await this.categoryRepository.remove(categoryFound);
}
}