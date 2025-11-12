const request = require('supertest');
const { app, server } = require('../src/app');

jest.mock('../src/models/userModel');


describe('Testes da API de Usuários', () => {
  it('Deve listar todos os usuários (GET /api/users)', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Deve criar um novo usuário (POST /api/users)', async () => {
    const novoUsuario = { name: 'Bruno Teste', email: 'bruno@teste.com' };
    const res = await request(app).post('/api/users').send(novoUsuario);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Bruno Teste');
  });

  // Fecha o servidor após os testes
  afterAll((done) => {
    server.close(done);
  });
});
