import { Router } from "express";
import { RoleController } from "../controllers/RoleController";

const router=Router();

router.get('/roles',RoleController.getRoles);
router.get('/roles/:id',RoleController.getRole);
router.post('/roles',RoleController.createRole);
router.put('/roles/:id',RoleController.updatedRole);
router.delete('/roles/:id',RoleController.deleteRole);

export default router;