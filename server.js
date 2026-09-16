import 'dotenv/config';
import express from 'express';
import consultasRoutes from './src/routes/consultasRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET deve ser definido no ambiente');

const app = express();
const PORTA = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/consultas', consultasRoutes);

app.use((req, res) => res.status(404).json({ mensagem: 'Rota não encontrada' }));

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
