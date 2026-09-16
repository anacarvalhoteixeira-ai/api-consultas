const autorizarCargos = (...cargosPermitidos) => (req, res, next) => {
  if (!req.user || !cargosPermitidos.includes(req.user.role)) {
    return res.status(403).json({ mensagem: 'Você não tem permissão para esta ação' });
  }
  return next();
};

export default autorizarCargos;
