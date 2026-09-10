const validate = (schema, campo) => {
    return (req, res, next) => {

        const resultado = schema.safeParse(req[campo]);

        if (!resultado.success) {
            return res.status(400).json({
                mensagem: "Dados inválidos",
                erros: resultado.error.issues
            });
        }

        req[campo] = resultado.data;

        next();
    };
};


module.exports = validate;