// tests/userService.test.js
const userService = require('../src/services/userService');
const userModel = require('../src/models/UserModel');

// Mock do módulo UserModel (apenas as funções usadas)
jest.mock('../src/models/UserModel', () => ({
  getAllUsers: jest.fn(),
  saveUsers: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn()
}));

describe('userService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('listUsers deve retornar todos os usuários', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, nome: 'Bruno' }]);
    const result = userService.listUsers();
    expect(result).toEqual([{ id: 1, nome: 'Bruno' }]);
  });

  test('getUserById deve retornar o usuário correto', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, nome: 'Bruno' }]);
    const result = userService.getUserById(1);
    expect(result).toEqual({ id: 1, nome: 'Bruno' });
  });

  test('createUser deve adicionar um novo usuário e salvar', () => {
    userModel.getAllUsers.mockReturnValue([]);
    // saveUsers é mock, já definido em jest.mock acima
    const novoUsuario = { nome: 'Maria' };
    const result = userService.createUser(novoUsuario);
    expect(result).toHaveProperty('id', 1);
    expect(result.nome).toBe('Maria');
    expect(userModel.saveUsers).toHaveBeenCalled();
  });

  test('updateUser deve atualizar usuário existente', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, nome: 'Bruno' }]);
    userModel.saveUsers.mockImplementation(() => {});
    const result = userService.updateUser(1, { nome: 'João' });
    expect(result.nome).toBe('João');
  });

  test('updateUser deve lançar erro se usuário não existir', () => {
    userModel.getAllUsers.mockReturnValue([]);
    expect(() => userService.updateUser(99, { nome: 'X' })).toThrow('Usuário não encontrado.');
  });

  test('deleteUser deve remover usuário existente e salvar', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, nome: 'Bruno' }]);
    userModel.saveUsers.mockImplementation(() => {});
    userService.deleteUser(1);
    expect(userModel.saveUsers).toHaveBeenCalled();
  });

  test('deleteUser deve lançar erro se não houver remoção', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, nome: 'Bruno' }]);
    // quando filtrar nenhum ID diferente de 99 permanece igual -> trigger error
    expect(() => userService.deleteUser(99)).toThrow('Usuário não encontrado.');
  });
});
