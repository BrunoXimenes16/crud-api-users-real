// tests/userController.test.js
const userController = require('../src/controllers/userController');
const userModel = require('../src/models/UserModel');

jest.mock('../src/models/UserModel');

describe('userController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('listUsers deve retornar lista de usuários (200)', async () => {
    userModel.getAllUsers.mockResolvedValue([{ id: 1, nome: 'Bruno' }]);
    await userController.listUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, nome: 'Bruno' }]);
  });

  test('getUserById deve retornar usuário existente (200)', async () => {
    req.params = { id: '1' };
    userModel.getUserById.mockResolvedValue({ id: 1, nome: 'Bruno' });
    await userController.getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, nome: 'Bruno' });
  });

  test('getUserById deve retornar 404 quando não encontrado', async () => {
    req.params = { id: '99' };
    userModel.getUserById.mockResolvedValue(null);
    await userController.getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
  });

  test('createUser deve criar usuário (201)', async () => {
    req.body = { nome: 'Maria' };
    userModel.createUser.mockResolvedValue({ id: 2, nome: 'Maria' });
    await userController.createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 2, nome: 'Maria' });
  });

  test('updateUser deve atualizar usuário (200)', async () => {
    req.params = { id: '1' };
    req.body = { nome: 'João' };
    userModel.updateUser.mockResolvedValue({ id: 1, nome: 'João' });
    await userController.updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, nome: 'João' });
  });

  test('deleteUser deve retornar 204', async () => {
    req.params = { id: '1' };
    userModel.deleteUser.mockResolvedValue();
    await userController.deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test('em caso de erro interno, retorna 500', async () => {
    userModel.getAllUsers.mockRejectedValue(new Error('boom'));
    await userController.listUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'boom' }));
  });
});
