import express from 'express';
import mainRouter from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use('/api', mainRouter)

export default app;

// app.listen(PORT, () => {
//   console.log(`🚀 Servidor rodando na porta ${PORT}`);
// });