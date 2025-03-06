import request from "supertest";
import app from '../server';
import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import { UserService } from "../services/UserService";


/*test("Debe responder con Hola mundo",async ()=>{
    const res=await request(app).get("/api/hello");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Hola mundo");
})*/

jest.mock('../services/UserService');

describe('GET /api/users',()=>{
 beforeAll(async ()=>{
    await AppDataSource.initialize();
 });

 afterAll(async ()=>{
    await AppDataSource.destroy();
 });

 it('deberia devolver una lista de usuarios con status 200', async ()=>{
  const mockUsers=[
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
  ];

  (UserService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

  const response=await request(app).get('/api/users');

  expect(response.status).toBe(200);
  expect(response.body).toEqual(mockUsers);

 });

 

it('deberia manejar errores y devolver status 500',async ()=>{
    (UserService.getUsers as jest.Mock).mockResolvedValue(new Error('Error en la base de datos'));
    const response=await request(app).get('/api/users');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error en la base de datos' });
});

});