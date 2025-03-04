import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router=Router();

router.get('/users',UserController.getUsers);
router.get('/users/:id', UserController.getUser);
router.post('/users',UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Función para manejar rutas async sin repetir try/catch en cada una
/*const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res)).catch(next);

router.get("/users", asyncHandler(UserController.getUsers));
router.post("/users", asyncHandler(UserController.createUser));*/

export default router;