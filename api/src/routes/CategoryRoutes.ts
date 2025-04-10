import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router=Router();
const categoryController = new CategoryController(); // Instancia del controlador

router.get('/categories',AuthMiddleware, categoryController.getCategories.bind(categoryController));
router.get('/categories/:id',AuthMiddleware, categoryController.getCategory.bind(categoryController));
router.post('/categories',categoryController.createCategory);
router.put('/categories/:id', categoryController.updatedCategory.bind(categoryController));
router.delete('/categories/:id', categoryController.deleteCategory.bind(categoryController));

export default router;