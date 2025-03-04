import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Acceso denegado, token no proporcionado' }); // Usar return para detener la ejecución
        return;
    }

    try {
        const decoded = verifyToken(token);
        (req as any).userId = decoded.userId; // Añade el userId al objeto req
        next(); // Pasar al siguiente middleware o ruta
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' }); // Usar return para detener la ejecución
        return;
    }
};