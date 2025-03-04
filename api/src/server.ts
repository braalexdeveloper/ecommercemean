import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import userRoutes from './routes/UserRoutes';
import roleRoutes from './routes/RoleRoutes';
import categoryRoutes from './routes/CategoryRoutes';
import productRoutes from './routes/ProductRoutes';
import saleRoutes from './routes/SaleRoutes';
import authRoutes from './routes/AuthRoutes';
import path from 'path';

dotenv.config();

const app=express();

//Middleware
app.use(cors());
app.use(express.json());
app.use('/api',userRoutes);
app.use('/api',roleRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',saleRoutes);
app.use('/api',authRoutes);

// Servir archivos estáticos desde la carpeta "uploads"
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

AppDataSource.initialize().then(()=>{
    console.log('✅ Base de datos conectada');

    // Iniciar Servidor
    app.listen(5000, () => console.log('🚀 Servidor corriendo en el puerto 5000'));
}).catch((error) => console.error('❌ Error al conectar la base de datos', error));

  