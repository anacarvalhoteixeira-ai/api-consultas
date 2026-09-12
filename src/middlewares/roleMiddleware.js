const autorizarCargos = (...cargosPermitidos) => {
    return (req, res, next) => {
        if (!cargosPermitidos.includes(req.user.role)) {
            return res.status(403).json({
                mensagem: 'Acesso negado: Recursos restritos'
            });
        }

        return next();
    };
};

module.exports = autorizarCargos;
