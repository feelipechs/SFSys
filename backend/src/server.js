import app from './config/server.js';
import config from './config/index.js';
import express from 'express';
// ⚠️ IMPORTANTE: Importar a função de conexão e o objeto db
import { connectDB, db } from './database/index.js';

// Importa todas as rotas
import authRoutes from './routes/auth.routes.js';
// ... outras rotas

// ------------------------------------------------------------------
// Função Assíncrona para Inicializar (Async IIFE)
// ------------------------------------------------------------------
async function startServer() {
  // 1. Conectar ao Banco de Dados (AGUARDA a conexão assíncrona)
  await connectDB();

  // 2. Middlewares e Configurações
  app.use(express.json());

  // === 3. Configuração de Rotas ===
  app.use('/api/auth', authRoutes);
  // ... use suas rotas aqui ...

  // Rota de teste
  app.get('/', (req, res) => {
    // Agora, você pode ter certeza que o DB está pronto
    res.send(
      `Servidor ON! Ambiente: ${config.NODE_ENV}. DB Status: Conectado.`,
    );
  });

  // 4. Inicialização
  const PORT = config.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`Ambiente: ${config.NODE_ENV}`);
  });
}

// Chama a função principal para iniciar tudo
startServer();

// Você pode exportar o objeto db para uso global se precisar, mas é opcional
// export const models = db;
