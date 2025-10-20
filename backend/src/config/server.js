import express from 'express';
// Opcional, mas recomendado para segurança
import helmet from 'helmet';
// Opcional, se precisar de CORS
import cors from 'cors';

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors());

export default app;
