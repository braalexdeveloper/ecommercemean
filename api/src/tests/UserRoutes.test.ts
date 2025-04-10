import request from 'supertest';

import { UserService } from '../services/UserService';
import app from '../server';

// Configura la aplicación Express
/*const app = express();
app.use(express.json());
app.get('/api/users', UserController.getUsers);*/

describe('GET /users', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    it('should return a list of users', async () => {
        const mockUsers = [
            {
                id: 3,
                email: 'brayan@gmail.com',
                password: 'brayan123',
                role: {
                    id: 1,
                    name: 'Almacen',
                    users: [],
                },
                sales: [],
            },
        ];

        // Mockea UserService.getUsers para devolver los usuarios
        jest.spyOn(UserService, 'getUsers').mockResolvedValue(mockUsers);

        // Realiza la solicitud a la ruta
        const res = await request(app).get('/api/users');

        // Verifica la respuesta
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUsers);
    });

    it('should handle errors and return status 500', async () => {
        const mockError = new Error('Error al obtener usuarios');

        // Mockea UserService.getUsers para lanzar un error
        jest.spyOn(UserService, 'getUsers').mockRejectedValue(mockError);

        // Realiza la solicitud a la ruta
        const res = await request(app).get('/api/users');

        // Verifica la respuesta de error
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Error al obtener usuarios' });
    });
});

describe('Get /user/id', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retunr a user', async () => {
        const user = {
            id: 3,
            email: 'brayan@gmail.com',
            password: 'brayan123',
            role: {
                id: 1,
                name: 'Almacen',
                users: [],
            },
            sales: [],
        }

        jest.spyOn(UserService, 'getUserById').mockResolvedValue(user);

        const res = await request(app).get('/api/users/3');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(user);
    });

    it('deberia devolver error 500',async ()=>{
        const mockError = new Error('Error al obtener usuario');
      jest.spyOn(UserService,'getUserById').mockRejectedValue(mockError);

      const res=await request(app).get('/api/users/3');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error:'Error al obtener usuario' });
    });

    
    it('deberia devolver error 404 si no encuentra el user',async ()=>{
    
      jest.spyOn(UserService,'getUserById').mockResolvedValue(null);

      const res=await request(app).get('/api/users/3');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Usuario no encontrado' });
    });

});