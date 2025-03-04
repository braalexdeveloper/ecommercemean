import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import upload from "../config/multer";

const router=Router();
const productController=new ProductController();

router.get('/products',productController.getProducts.bind(productController));
router.get('/products/:id',productController.getProduct.bind(productController));
router.post('/products',upload.single('img'),productController.createProduct.bind(productController));
router.put('/products/:id',upload.single('img'),productController.updatedProduct.bind(productController));
router.delete('/products/:id',productController.deleteProduct.bind(productController));

export default router;