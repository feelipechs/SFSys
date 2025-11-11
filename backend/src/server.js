import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; // utilitário para simular __dirname
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { connectDB } from './database/index.js';

// funções auxiliares para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ----------------------------------------

// carregamento inteligente do .env
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}${nodeEnv === 'development' ? '.local' : ''}`;
const envPath = path.resolve(__dirname, '..', envFile);
dotenv.config({ path: envPath });

// express setup
const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.use(express.json()); // middleware para ler body JSON
app.use(routes); // carrega todas as rotas

const PORT = process.env.PORT || 3000;

// início do servidor
async function startServer() {
  try {
    console.log('Tentando conectar ao Banco de Dados...');
    await connectDB(); // garante a conexão antes de subir o servidor

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Ambiente: ${nodeEnv}`);
    });
  } catch (error) {
    console.error('Falha Crítica ao Iniciar o Servidor:', error.message);
    process.exit(1);
  }
}

startServer();
