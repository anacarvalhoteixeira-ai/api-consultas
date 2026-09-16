import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensagem: 'Token de autenticação não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = Number(decoded.sub);
    if (!Number.isInteger(id) || !decoded.role) throw new Error('Token inválido');
    req.user = { id, role: decoded.role };
    return next();
  } catch {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
  }
};

export default authMiddleware;
