const validate = (schema, campo) => (req, res, next) => {
  const resultado = schema.safeParse(req[campo]);

  if (!resultado.success) {
    return res.status(400).json({
      mensagem: 'Dados inválidos',
      erros: resultado.error.issues.map(({ path, message }) => ({ campo: path.join('.'), mensagem: message })),
    });
  }
  
  req[campo] = resultado.data;
  return next();
};

export default validate;
