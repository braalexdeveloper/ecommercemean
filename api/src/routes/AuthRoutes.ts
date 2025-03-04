
import {AuthController} from '../controllers/AuthController';

import { Router } from 'express';

const router=Router();
const authController=new AuthController();

router.post('/auth',authController.login.bind(authController));
router.post('/register',authController.register.bind(authController));

export default router;