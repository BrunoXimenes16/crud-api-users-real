const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(bodyParser.json());

// Rotas principais
app.use('/api/users', userRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('CRUD API Users');
});

// Iniciar o servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Exporta o app e o servidor para uso nos testes
module.exports = { app, server };
