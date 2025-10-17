import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

// IMPORTAÇÃO DOS MODELS E INSTÂNCIA DO SEQUELIZE
// Este 'db' agora contém a instância do Sequelize e todos os Models
import db from './models/index.js'; // Assumindo que você criou models/index.js

// Renomeando as importações das rotas

const app = express();
const PORT = process.env.PORT;

// ----------------------------------------------------
// 1. MIDDLEWARES (Onde ficam os app.use() globais)
// ----------------------------------------------------
app.use(express.json());
// Você pode adicionar mais aqui:
app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// ----------------------------------------------------

// ----------------------------------------------------
// 2. ASSOCIAÇÃO DAS ROTAS (Onde ficam os app.use('/caminho', router))
// ----------------------------------------------------
// Atualizando os caminhos das rotas para refletir a nova organização

// tratar rotas não encontradas (Este é um middleware de erro final)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});
// ----------------------------------------------------

// ----------------------------------------------------
// 3. INICIALIZAÇÃO DO SERVIDOR E DB
// ----------------------------------------------------
// Primeiro, sincroniza o banco de dados. Isso cria as tabelas (Alunos, Cursos, Inscricoes)
db.sequelize
  .sync({ force: false }) // Use force: true APENAS em desenvolvimento.
  .then(() => {
    console.log('Banco de dados sincronizado e tabelas criadas!');

    // Depois de sincronizado, inicia o servidor HTTP
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // Se houver erro no banco (ex: problema de conexão/permissão), a aplicação deve falhar
    console.error('Erro ao sincronizar o banco:', err);
    process.exit(1);
  });
