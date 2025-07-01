export default function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autorização não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  const SECRET_KEY = 'minha-chave-secreta'; 

  if (token !== SECRET_KEY) {
    return res.status(403).json({ error: 'Token inválido ou não autorizado' });
  }

  next();
}
