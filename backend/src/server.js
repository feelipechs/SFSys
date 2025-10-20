import app from './config/server.js';
import config from './config/index.js';
import './database/connection.js'; // Importa para inicializar a conexão DB e Models

// Importa todas as rotas
import authRoutes from './routes/auth.routes.js';
import staffRoutes from './routes/staff.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
// ... outras rotas

// Middleware para tratamento de JSON
app.use(express.json());

// === Configuração de Rotas ===
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/campaigns', campaignRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send(`Servidor ON! Ambiente: ${config.NODE_ENV}`);
});

// Inicialização
const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${config.NODE_ENV}`);
});
