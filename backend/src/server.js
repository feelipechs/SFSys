import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; // Utilitário para simular __dirname
import express from 'express';
import routes from './routes/index.js'; // Note o .js na importação
import { connectDB } from './database/index.js'; // Note o .js na importação

// --- Funções Auxiliares para ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ----------------------------------------

// --- Carregamento Inteligente do .env ---
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}${nodeEnv === 'development' ? '.local' : ''}`;
const envPath = path.resolve(__dirname, '..', envFile);
dotenv.config({ path: envPath });

// --- Express Setup ---
const app = express();

app.use(express.json()); // Middleware essencial para ler body JSON
app.use(routes); // Carrega todas as rotas

const PORT = process.env.PORT || 3000;

// --- Início do Servidor ---
async function startServer() {
  try {
    console.log('🔗 Tentando conectar ao Banco de Dados...');
    await connectDB(); // Garante a conexão antes de subir o servidor

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
