import { SaleController } from "../controllers/SaleController";
import { Router } from "express";


const router=Router();
const saleController=new SaleController();

router.get('/sales',saleController.getSales.bind(saleController));
router.get('/sales/:id',saleController.getSale.bind(saleController));
router.post('/sales',saleController.createSale.bind(saleController));
router.get('/sales/user/:user_id',saleController.getSalesByUser.bind(saleController));

export default router;
