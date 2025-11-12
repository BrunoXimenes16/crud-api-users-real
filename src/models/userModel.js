const mysql = require('mysql2/promise');

// Configuração da conexão com o banco de dados
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Função para conectar ao banco de dados
const connectDB = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Conectado ao banco de dados!");
        return connection;
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error.message || error);
        throw error;
    }
};

// Função para listar todos os usuários
const getAllUsers = async () => {
    const connection = await connectDB();
    const [rows] = await connection.execute('SELECT * FROM users');
    await connection.end();
    return rows;
};

// Função para obter um usuário por ID
const getUserById = async (id) => {
    const connection = await connectDB();
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
    await connection.end();
    return rows[0];
};

// Função para criar um novo usuário
const createUser = async (userData) => {
    const connection = await connectDB();
    const [result] = await connection.execute(
        'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)',
        [userData.name, userData.email, userData.phone]
    );
    await connection.end();
    return { id: result.insertId, ...userData };
};

// Função para atualizar um usuário
const updateUser = async (id, updatedData) => {
    const connection = await connectDB();
    await connection.execute(
        'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
        [updatedData.name, updatedData.email, updatedData.phone, id]
    );
    await connection.end();
    return { id, ...updatedData };
};

// Função para deletar um usuário
const deleteUser = async (id) => {
    const connection = await connectDB();
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    await connection.end();
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };

module.exports = {
  getAllUsers: jest.fn(async () => [
    { id: 1, name: 'Usuário Falso', email: 'teste@mock.com' },
  ]),
  createUser: jest.fn(async (user) => ({
    id: 2,
    ...user,
  })),
  updateUser: jest.fn(async (id, user) => ({
    id,
    ...user,
  })),
  deleteUser: jest.fn(async (id) => ({
    success: true,
  })),
};
